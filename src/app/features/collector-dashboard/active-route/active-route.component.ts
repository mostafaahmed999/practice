import { Component, computed, inject } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../../shared/ui/card/card.component';

@Component({
  selector: 'app-collector-active-route',
  standalone: true,
  imports: [
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent
  ],
  templateUrl: './active-route.component.html',
  styleUrl: './active-route.component.css'
})
export class CollectorActiveRouteComponent {
  dataService = inject(DataService);
  collectorId = 1;

  activeRouteRequests = computed(() => {
    return this.dataService.getRequestsByCollectorId(this.collectorId)
      .filter(r => r.status === 'in-progress')
      .sort((a, b) => (a.routeOrder || 0) - (b.routeOrder || 0));
  });

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
