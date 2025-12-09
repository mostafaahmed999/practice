import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { DataService } from '../../core/services/data.service';
import { CollectionRequest } from '../../models/collection-request.model';
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
  templateUrl: './collector-dashboard.component.html',
  styleUrls: ['./collector-dashboard.component.css']
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
