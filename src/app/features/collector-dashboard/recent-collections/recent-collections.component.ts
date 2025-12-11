import { Component, computed, inject } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { RequestCardComponent } from '../../../shared/ui/request-card/request-card.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../../shared/ui/card/card.component';

@Component({
  selector: 'app-collector-recent-collections',
  standalone: true,
  imports: [
    RequestCardComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent
  ],
  templateUrl: './recent-collections.component.html',
  styleUrl: './recent-collections.component.css'
})
export class CollectorRecentCollectionsComponent {
  dataService = inject(DataService);
  collectorId = 1;

  recentCollections = computed(() => 
    this.dataService.completedRequests()
      .filter(r => r.collectorId === this.collectorId)
      .slice(0, 5)
  );
}
