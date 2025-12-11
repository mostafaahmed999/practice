import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { CollectionRequest } from '../../../core/models/collection-request.model';
import { RequestCardComponent } from '../../../shared/ui/request-card/request-card.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../../shared/ui/card/card.component';

@Component({
  selector: 'app-citizen-recent-requests',
  standalone: true,
  imports: [
    CommonModule,
    RequestCardComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent
  ],
  templateUrl: './recent-requests.component.html',
  styleUrl: './recent-requests.component.css'
})
export class CitizenRecentRequestsComponent {
  @Input() requests: CollectionRequest[] = [];

  languageService = inject(LanguageService);
  
  t = (key: string) => this.languageService.t(key);
}
