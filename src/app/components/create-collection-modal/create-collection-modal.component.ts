import { Component, Input, Output, EventEmitter, inject, signal, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { DataService } from '../../core/services/data.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { MapContainerComponent } from '../map-container/map-container.component';
import { CollectionRequest } from '../../models/collection-request.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-create-collection-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, MapContainerComponent],
  template: `
    @if (open) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" (click)="close()">
        <div class="bg-card rounded-lg border border-border shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
          <div class="p-6">
            <h2 class="text-2xl font-bold mb-4">{{ t('createRequest') }}</h2>
            
            <form [formGroup]="form" (ngSubmit)="handleSubmit()" class="space-y-6">
              <!-- Location Selection with Map -->
              <div class="space-y-2">
                <label class="text-sm font-medium">{{ t('pickupLocation') }}</label>
                
                <!-- Map for location selection -->
                <div class="w-full h-[300px] rounded-lg overflow-hidden border border-border">
                  <app-map-container
                    [height]="300"
                    [showMarkers]="false"
                    [center]="selectedLocation() || defaultCenter"
                    [zoom]="13"
                    (mapReady)="onMapReady($event)"
                  ></app-map-container>
                </div>

                <!-- Selected Location Display -->
                @if (selectedLocation()) {
                  <div class="p-3 bg-primary/10 rounded-md border border-primary/20">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium">📍 Selected Location</p>
                        <p class="text-xs text-muted-foreground">
                          Lat: {{ selectedLocation()?.[0]?.toFixed(6) }}, 
                          Lng: {{ selectedLocation()?.[1]?.toFixed(6) }}
                        </p>
                        @if (selectedAddress()) {
                          <p class="text-sm mt-1">{{ selectedAddress() }}</p>
                        }
                      </div>
                <button
                  type="button"
                        (click)="clearLocation()"
                        class="text-sm text-destructive hover:underline"
                >
                        Clear
                </button>
                    </div>
                  </div>
                } @else {
                  <div class="p-3 bg-muted/50 rounded-md border border-border">
                    <p class="text-sm text-muted-foreground">
                      📍 {{ t('clickToSelect') }} - Click on the map to select your location
                    </p>
                  </div>
                }

                <!-- Address Input -->
                <div class="space-y-2">
                  <label for="address" class="text-sm font-medium">Address (Optional)</label>
                  <input
                    id="address"
                    type="text"
                    formControlName="address"
                    placeholder="Enter your address"
                    class="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
              </div>

              <!-- Materials -->
              <div class="space-y-2">
                <label class="text-sm font-medium">{{ t('materialsToCollect') }}</label>
                <div class="grid grid-cols-2 gap-3">
                  <label class="flex items-center space-x-2 p-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors" [class.bg-primary/10]="selectedMaterials().includes('plastic')">
                    <input type="checkbox" [checked]="selectedMaterials().includes('plastic')" (change)="toggleMaterial('plastic')" class="rounded" />
                    <span>♻ {{ t('plastic') }}</span>
                  </label>
                  <label class="flex items-center space-x-2 p-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors" [class.bg-primary/10]="selectedMaterials().includes('paper')">
                    <input type="checkbox" [checked]="selectedMaterials().includes('paper')" (change)="toggleMaterial('paper')" class="rounded" />
                    <span>📄 {{ t('paper') }}</span>
                  </label>
                  <label class="flex items-center space-x-2 p-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors" [class.bg-primary/10]="selectedMaterials().includes('glass')">
                    <input type="checkbox" [checked]="selectedMaterials().includes('glass')" (change)="toggleMaterial('glass')" class="rounded" />
                    <span>🍶 {{ t('glass') }}</span>
                  </label>
                  <label class="flex items-center space-x-2 p-3 border border-input rounded-md cursor-pointer hover:bg-muted/50 transition-colors" [class.bg-primary/10]="selectedMaterials().includes('metal')">
                    <input type="checkbox" [checked]="selectedMaterials().includes('metal')" (change)="toggleMaterial('metal')" class="rounded" />
                    <span>🔩 {{ t('metal') }}</span>
                  </label>
                </div>
              </div>

              <!-- Quantity -->
              <div class="space-y-2">
                <label for="quantity" class="text-sm font-medium">{{ t('estimatedQuantity') }}</label>
                <input
                  id="quantity"
                  type="number"
                  formControlName="quantity"
                  placeholder="0"
                  min="1"
                  class="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>

              <!-- Preferred Time -->
              <div class="space-y-2">
                <label for="preferredTime" class="text-sm font-medium">{{ t('preferredTime') }}</label>
                <input
                  id="preferredTime"
                  type="datetime-local"
                  formControlName="preferredTime"
                  class="w-full px-3 py-2 border border-input rounded-md bg-background"
                />
              </div>

              <!-- Actions -->
              <div class="flex gap-4 pt-4">
                <app-button type="button" variant="outline" (onClick)="close()" class="flex-1">
                  {{ t('cancel') }}
                </app-button>
                <app-button 
                  type="submit" 
                  class="flex-1"
                  [disabled]="!isFormValid()"
                >
                  {{ t('submitRequest') }}
                </app-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `,
  styles: []
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
