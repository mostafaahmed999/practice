import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { DataService } from '../../core/services/data.service';
import { CollectionRequest } from '../../core/models/collection-request.model';
import { CollectorHeaderComponent } from './header/header.component';
import { CollectorStatsCardsComponent } from './stats-cards/stats-cards.component';
import { CollectorActiveRouteComponent } from './active-route/active-route.component';
import { CollectorMapRequestsComponent } from './map-requests/map-requests.component';
import { CollectorAvailableRequestsComponent } from './available-requests/available-requests.component';
import { CollectorRecentCollectionsComponent } from './recent-collections/recent-collections.component';

@Component({
  selector: 'app-collector-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CollectorHeaderComponent,
    CollectorStatsCardsComponent,
    CollectorActiveRouteComponent,
    CollectorMapRequestsComponent,
    CollectorAvailableRequestsComponent,
    CollectorRecentCollectionsComponent
  ],
  templateUrl: './collector-dashboard.component.html',
  styleUrl: './collector-dashboard.component.css'
})
export class CollectorDashboardComponent {
  languageService = inject(LanguageService);
  dataService = inject(DataService);
  
  t = (key: string) => this.languageService.t(key);

  selectedRequest = signal<CollectionRequest | null>(null);
  collectorId = 1; // Current collector ID

  selectRequest(request: CollectionRequest): void {
    this.selectedRequest.set(request);
    // Map will handle centering automatically via marker click
  }

  acceptRequest(request: CollectionRequest): void {
    // Get current active route requests
    const activeRoute = this.dataService.getRequestsByCollectorId(this.collectorId)
      .filter(r => r.status === 'in-progress');
    
    // Calculate route order (next in sequence)
    const routeOrder = activeRoute.length + 1;
    
    // Calculate estimated arrival time
    const now = new Date();
    const minutesToAdd = routeOrder * 30;
    const estimatedArrival = new Date(now.getTime() + minutesToAdd * 60 * 1000);
    
    // Accept request and add to route
    this.dataService.acceptRequestForRoute(
      request.id,
      this.collectorId,
      estimatedArrival.toISOString(),
      routeOrder
    );
    
    console.log(`Accepted request: ${request.material} from ${request.citizenName}`);
    console.log(`Route order: ${routeOrder}`);
  }
}
