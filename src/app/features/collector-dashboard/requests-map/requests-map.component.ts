import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionRequest } from '../../../core/models/collection-request.model';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../../shared/ui/card/card.component';
import { MapContainerComponent } from '../../../shared/components/map-container/map-container.component';

@Component({
  selector: 'app-collector-requests-map',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    MapContainerComponent
  ],
  templateUrl: './requests-map.component.html',
  styleUrl: './requests-map.component.css'
})
export class CollectorRequestsMapComponent {
  @Input() requests: CollectionRequest[] = [];
  @Output() requestSelected = new EventEmitter<CollectionRequest>();

  onRequestSelected(request: CollectionRequest): void {
    this.requestSelected.emit(request);
  }
}
