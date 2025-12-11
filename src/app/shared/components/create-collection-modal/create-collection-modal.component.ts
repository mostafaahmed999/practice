import { Component, Input, Output, EventEmitter, inject, signal, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { DataService } from '../../../core/services/data.service';
import { ButtonComponent } from '../../ui/button/button.component';
import { MapContainerComponent } from '../map-container/map-container.component';
import { CollectionRequest } from '../../../core/models/collection-request.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-create-collection-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, MapContainerComponent],
  templateUrl: './create-collection-modal.component.html',
  styleUrl: './create-collection-modal.component.css'
})
export class CreateCollectionModalComponent implements AfterViewInit, OnChanges {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @Output() requestCreated = new EventEmitter<CollectionRequest>();

  private fb = inject(FormBuilder);
  languageService = inject(LanguageService);
  dataService = inject(DataService);

  t = (key: string) => this.languageService.t(key);

  selectedMaterials = signal<string[]>([]);
  selectedLocation = signal<[number, number] | null>(null);
  selectedAddress = signal<string>('');
  defaultCenter: [number, number] = [30.0444, 31.2357]; // Cairo, Egypt
  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  form: FormGroup = this.fb.group({
    address: [''],
    quantity: ['', [Validators.required, Validators.min(1)]],
    preferredTime: ['', Validators.required]
  });

  ngAfterViewInit(): void {
    // Component initialized
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Reset form when modal opens
    if (changes['open'] && this.open) {
      setTimeout(() => {
        this.resetForm();
      }, 100);
    }
  }

  onMapReady(map: L.Map): void {
    this.map = map;

    // Add click handler to map
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      this.selectedLocation.set([lat, lng]);
      this.updateMarker(lat, lng);
      this.reverseGeocode(lat, lng);
    });

    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.defaultCenter = [lat, lng];
          if (this.map) {
            this.map.setView([lat, lng], 13);
          }
        },
        () => {
          // Use default location if geolocation fails
          console.log('Geolocation not available, using default location');
        }
      );
    }
  }

  updateMarker(lat: number, lng: number): void {
    if (!this.map) return;

    // Remove existing marker
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Add new marker
    this.marker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: #3b82f6;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          font-size: 18px;
        ">📍</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })
    }).addTo(this.map);
  }

  reverseGeocode(lat: number, lng: number): void {
    // Simple reverse geocoding using OpenStreetMap Nominatim API
    // In production, you might want to use a more robust service
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(response => response.json())
      .then(data => {
        if (data.display_name) {
          this.selectedAddress.set(data.display_name);
          // Auto-fill address field
          this.form.patchValue({ address: data.display_name });
        }
      })
      .catch(() => {
        // If reverse geocoding fails, just use coordinates
        this.selectedAddress.set(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
      });
  }

  clearLocation(): void {
    this.selectedLocation.set(null);
    this.selectedAddress.set('');
    if (this.marker && this.map) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
    this.form.patchValue({ address: '' });
  }

  toggleMaterial(material: string): void {
    const current = this.selectedMaterials();
    if (current.includes(material)) {
      this.selectedMaterials.set(current.filter(m => m !== material));
    } else {
      this.selectedMaterials.set([...current, material]);
    }
  }

  isFormValid(): boolean {
    return this.form.valid && 
           this.selectedMaterials().length > 0 && 
           this.selectedLocation() !== null;
  }

  resetForm(): void {
    this.form.reset();
    this.selectedMaterials.set([]);
    this.selectedLocation.set(null);
    this.selectedAddress.set('');
    if (this.marker && this.map) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
  }

  close(): void {
    this.resetForm();
    this.open = false;
    this.openChange.emit(false);
  }

  handleSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }

    const location = this.selectedLocation();
    if (!location) {
      return;
    }

    const user = this.dataService.currentUser();
    const formValue = this.form.value;
    const materials = this.selectedMaterials();

    // Generate material name from selected materials
    const materialNames: { [key: string]: string } = {
      plastic: 'Plastic',
      paper: 'Paper',
      glass: 'Glass',
      metal: 'Metal'
    };
    const materialName = materials.map(m => materialNames[m] || m).join(' & ') || 'Mixed Recyclables';

    // Create new collection request
    const newRequest: CollectionRequest = {
      id: Date.now(), // In production, this should come from the backend
      material: materialName,
      weight: `${formValue.quantity} kg`,
      location: formValue.address || `Lat: ${location[0].toFixed(6)}, Lng: ${location[1].toFixed(6)}`,
      lat: location[0],
      lng: location[1],
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      citizenId: user.id,
      citizenName: user.name,
      estimatedQuantity: formValue.quantity,
      preferredTime: formValue.preferredTime,
      materials: materials
    };

    // Add request to data service
    this.dataService.addRequest(newRequest);

    // Update user stats
    this.dataService.updateUserStats('collections', 1);

    // Add points for creating request
    this.dataService.addPoints(10, 'Created collection request', newRequest.id);

    // Emit event
    this.requestCreated.emit(newRequest);

    // Show success message
    console.log('Request created successfully:', newRequest);

    // Close modal
    this.close();
  }
}
