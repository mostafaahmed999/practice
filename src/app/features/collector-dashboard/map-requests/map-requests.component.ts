import { Component, computed, inject, output } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { CollectionRequest } from '../../../core/models/collection-request.model';
import { MapContainerComponent } from '../../../shared/components/map-container/map-container.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../../shared/ui/card/card.component';

@Component({
  selector: 'app-collector-map-requests',
  standalone: true,
  imports: [
    MapContainerComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent
  ],
  templateUrl: './map-requests.component.html',
  styleUrl: './map-requests.component.css'
})
export class CollectorMapRequestsComponent {
  dataService = inject(DataService);
  
  allRequests = computed(() => this.dataService.collectionRequests());
  
  selectRequest = output<CollectionRequest>();

  onMarkerClick(request: CollectionRequest): void {
    this.selectRequest.emit(request);
  }
}
