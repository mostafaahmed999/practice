import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { CollectionRequest } from '../../../core/models/collection-request.model';

@Component({
  selector: 'app-map-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      #mapContainer 
      id="map-container"
      class="w-full h-full rounded-lg overflow-hidden"
      [style.height.px]="height"
    ></div>
  `,
  styles: [`
    #map-container {
      position: relative;
      z-index: 1;
    }
    
    ::ng-deep .leaflet-container {
      width: 100%;
      height: 100%;
      border-radius: 0.5rem;
      z-index: 1;
    }

    ::ng-deep .custom-marker {
      background: transparent;
      border: none;
    }
  `]
})
export class MapContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;
  
  @Input() requests: CollectionRequest[] = [];
  @Input() height: number = 400;
  @Input() center: [number, number] = [30.0444, 31.2357];
  @Input() zoom: number = 12;
  @Input() showMarkers: boolean = true;
  
  @Output() markerClick = new EventEmitter<CollectionRequest>();
  @Output() mapReady = new EventEmitter<L.Map>();

  private map: L.Map | null = null;
  private markers: L.Marker[] = [];

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    // Initialize map after view is fully rendered
    setTimeout(() => {
      this.initMap();
    }, 300);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.markers = [];
  }

  private initMap(): void {
    if (!this.mapContainer?.nativeElement) {
      console.error('Map container not found');
      return;
    }

    // Create map
    this.map = L.map(this.mapContainer.nativeElement, {
      center: this.center,
      zoom: this.zoom,
      zoomControl: true
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Add markers if enabled
    if (this.showMarkers && this.requests.length > 0) {
      this.addMarkers();
    }

    // Emit map ready event
    this.mapReady.emit(this.map);

    // Invalidate size to ensure proper rendering
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 100);
  }

  private addMarkers(): void {
    if (!this.map) return;

    // Clear existing markers
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Add markers for each request
    this.requests.forEach(request => {
      if (request.lat && request.lng) {
        const marker = L.marker([request.lat, request.lng], {
          icon: this.getMarkerIcon(request.status)
        }).addTo(this.map!);

        // Add popup
        marker.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold mb-1">${request.material}</h3>
            <p class="text-sm text-gray-600">${request.location}</p>
            <p class="text-sm text-gray-600">${request.weight || ''} ${request.distance ? '• ' + request.distance : ''}</p>
            ${request.citizenName ? `<p class="text-xs text-gray-500 mt-1">${request.citizenName}</p>` : ''}
          </div>
        `);

        // Add click handler
        marker.on('click', () => {
          this.markerClick.emit(request);
        });

        this.markers.push(marker);
      }
    });

    // Fit map to show all markers
    if (this.requests.length > 0 && this.requests.some(r => r.lat && r.lng)) {
      const bounds = L.latLngBounds(
        this.requests
          .filter(r => r.lat && r.lng)
          .map(r => [r.lat!, r.lng!] as [number, number])
      );
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  private getMarkerIcon(status: string): L.DivIcon {
    const color = status === 'pending' ? '#3b82f6' : status === 'in-progress' ? '#f97316' : '#22c55e';
    const emoji = status === 'pending' ? '📍' : status === 'in-progress' ? '🚛' : '✅';
    
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        font-size: 18px;
      ">${emoji}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  }

  // Public method to update markers
  updateMarkers(requests: CollectionRequest[]): void {
    this.requests = requests;
    if (this.map && this.showMarkers) {
      this.addMarkers();
    }
  }

  // Public method to center map on location
  centerMap(lat: number, lng: number, zoom?: number): void {
    if (this.map) {
      this.map.setView([lat, lng], zoom || this.zoom);
    }
  }

  // Public method to invalidate size (useful when container size changes)
  invalidateSize(): void {
    if (this.map) {
      setTimeout(() => {
        this.map!.invalidateSize();
      }, 100);
    }
  }
}

