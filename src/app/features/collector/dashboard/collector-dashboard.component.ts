import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { DataService } from '../../core/services/data.service';
import { CollectionRequest } from '../../core/models/collection-request.model';
import { StatCardComponent } from '../../shared/ui/stat-card/stat-card.component';
import { RequestCardComponent } from '../../shared/ui/request-card/request-card.component';
import { MapContainerComponent } from '../../components/map-container/map-container.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../shared/ui/card/card.component';

@Component({
  selector: 'app-collector-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    RequestCardComponent,
    MapContainerComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent
  ],
  template: `
    <div class="min-h-screen py-8 px-4 md:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-foreground">{{ t('collectorDashboard') }}</h1>
            <p class="text-muted-foreground mt-2">Manage your collection routes and requests</p>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid md:grid-cols-4 gap-6">
          <app-stat-card *ngFor="let stat of stats()" [stat]="stat"></app-stat-card>
        </div>

        <!-- Active Routes Section -->
        @if (activeRouteRequests().length > 0) {
          <app-card class="shadow-md">
            <app-card-header>
              <app-card-title class="text-xl">🚛 Active Route</app-card-title>
              <app-card-description>Your current collection route with estimated arrival times</app-card-description>
            </app-card-header>
            <app-card-content>
              <div class="space-y-3">
                <div
                  *ngFor="let request of activeRouteRequests(); let i = index"
                  class="p-4 border border-border rounded-lg bg-muted/30"
                >
                  <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-3">
                      <div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                        {{ request.routeOrder }}
                      </div>
                      <div>
                        <h3 class="font-medium text-card-foreground">{{ request.material }}</h3>
                        <p class="text-sm text-muted-foreground">{{ request.citizenName }} • {{ request.location }}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      @if (request.estimatedArrivalTime) {
                        <p class="text-sm font-medium text-primary">Estimated Arrival</p>
                        <p class="text-xs text-muted-foreground">{{ formatArrivalTime(request.estimatedArrivalTime) }}</p>
                      }
                    </div>
                  </div>
                  <div class="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span>⚖️ {{ request.weight }}</span>
                    @if (request.distance) {
                      <span>📏 {{ request.distance }}</span>
                    }
                  </div>
                </div>
              </div>
            </app-card-content>
          </app-card>
        }

        <!-- Map and Requests -->
        <div class="grid lg:grid-cols-2 gap-6">
          <!-- Map Section -->
          <app-card class="shadow-md">
            <app-card-header>
              <app-card-title class="text-xl">🗺️ Collection Requests Map</app-card-title>
              <app-card-description>View all collection requests on the map</app-card-description>
            </app-card-header>
            <app-card-content class="p-0 overflow-hidden">
              <app-map-container
                [requests]="allRequests()"
                [height]="400"
                (markerClick)="selectRequest($event)"
              ></app-map-container>
            </app-card-content>
          </app-card>

          <!-- Available Requests List -->
          <app-card class="shadow-md">
            <app-card-header>
              <app-card-title class="text-xl">📦 Available Requests</app-card-title>
              <app-card-description>Pick up requests in your area</app-card-description>
            </app-card-header>
            <app-card-content>
              <div class="space-y-4 max-h-[400px] overflow-y-auto">
                <app-request-card
                  *ngFor="let request of pendingRequests()"
                  [request]="request"
                  [showActions]="true"
                  (onCardClick)="selectRequest($event)"
                  (onAccept)="acceptRequest($event)"
                ></app-request-card>
                @if (pendingRequests().length === 0) {
                  <div class="text-center py-8 text-muted-foreground">
                    <span class="text-4xl block mb-2">📦</span>
                    <p>No available requests</p>
                  </div>
                }
              </div>
            </app-card-content>
          </app-card>
        </div>

        <!-- Recent Collections -->
        <app-card class="shadow-md">
          <app-card-header>
            <app-card-title class="text-xl">🔄 Recent Collections</app-card-title>
            <app-card-description>Your recent collection history</app-card-description>
          </app-card-header>
          <app-card-content>
            <div class="space-y-3">
              <app-request-card
                *ngFor="let request of recentCollections()"
                [request]="request"
                [clickable]="false"
                [showActions]="false"
              ></app-request-card>
              @if (recentCollections().length === 0) {
                <div class="text-center py-8 text-muted-foreground">
                  <span class="text-4xl block mb-2">📦</span>
                  <p>No recent collections</p>
                </div>
              }
            </div>
          </app-card-content>
        </app-card>
      </div>
    </div>
  `,
  styles: []
})
export class CollectorDashboardComponent {
  languageService = inject(LanguageService);
  dataService = inject(DataService);
  
  t = (key: string) => this.languageService.t(key);

  selectedRequest = signal<CollectionRequest | null>(null);
  collectorId = 1; // Current collector ID

  // Get data from service
  stats = computed(() => {
    const baseStats = this.dataService.userStats();
    const activeRoutesCount = this.activeRouteRequests().length;
    
    // Update active routes stat dynamically
    return baseStats.map(stat => {
      if (stat.id === 'active-routes') {
        return {
          ...stat,
          value: String(activeRoutesCount)
        };
      }
      return stat;
    });
  });
  
  allRequests = computed(() => this.dataService.collectionRequests());
  pendingRequests = computed(() => 
    this.dataService.pendingRequests().filter(r => !r.collectorId || r.collectorId !== this.collectorId)
  );
  
  // Active route: in-progress requests for this collector, sorted by route order
  activeRouteRequests = computed(() => {
    const collectorRequests = this.dataService.getRequestsByCollectorId(this.collectorId)
      .filter(r => r.status === 'in-progress')
      .sort((a, b) => (a.routeOrder || 0) - (b.routeOrder || 0));
    return collectorRequests;
  });

  recentCollections = computed(() => 
    this.dataService.completedRequests()
      .filter(r => r.collectorId === this.collectorId)
      .slice(0, 5)
  );

  selectRequest(request: CollectionRequest): void {
    this.selectedRequest.set(request);
    // Map will handle centering automatically via marker click
  }

  acceptRequest(request: CollectionRequest): void {
    // Get current active route requests
    const activeRoute = this.activeRouteRequests();
    
    // Calculate route order (next in sequence)
    const routeOrder = activeRoute.length + 1;
    
    // Calculate estimated arrival time
    // Start from current time + 30 minutes for first request
    // Each subsequent request adds 30 minutes
    const now = new Date();
    const minutesToAdd = routeOrder * 30; // 30 minutes between each request
    const estimatedArrival = new Date(now.getTime() + minutesToAdd * 60 * 1000);
    
    // Accept request and add to route
    this.dataService.acceptRequestForRoute(
      request.id,
      this.collectorId,
      estimatedArrival.toISOString(),
      routeOrder
    );
    
    console.log(`Accepted request: ${request.material} from ${request.citizenName}`);
    console.log(`Estimated arrival: ${this.formatArrivalTime(estimatedArrival.toISOString())}`);
    console.log(`Route order: ${routeOrder}`);
  }

  formatArrivalTime(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `In ${diffMins} minutes`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `In ${hours}h ${mins}m`;
    }
  }
}
