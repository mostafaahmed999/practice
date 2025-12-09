import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { DataService } from '../../core/services/data.service';
import { UserService } from '../../core/services/user.service';
import { CollectionRequest } from '../../models/collection-request.model';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { StatCardComponent } from '../../shared/ui/stat-card/stat-card.component';
import { RequestCardComponent } from '../../shared/ui/request-card/request-card.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../shared/ui/card/card.component';
import { CreateCollectionModalComponent } from '../../components/create-collection-modal/create-collection-modal.component';

@Component({
  selector: 'app-citizen-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    StatCardComponent,
    RequestCardComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    CreateCollectionModalComponent
  ],
  templateUrl: './citizen-dashboard.component.html',
  styleUrls: ['./citizen-dashboard.component.css']
})
export class CitizenDashboardComponent {
  languageService = inject(LanguageService);
  dataService = inject(DataService);
  userService = inject(UserService);
  
  modalOpen = signal(false);

  t = (key: string) => this.languageService.t(key);

  // Get user-specific stats
  stats = computed(() => {
    const user = this.dataService.currentUser();
    return [
    {
        id: 'total-collections',
      icon: '📦',
      label: this.t('totalCollections'),
        value: String(user.totalCollections || 0),
      change: '+3 this month',
      color: 'text-primary'
    },
    {
        id: 'co2-saved',
      icon: '📈',
      label: this.t('co2Saved'),
      value: '145 kg',
      change: '+12 kg this week',
      color: 'text-accent'
    },
    {
        id: 'reward-points',
      icon: '🎁',
      label: this.t('rewardPoints'),
        value: String(user.points || 0),
      change: 'Redeem now',
      color: 'text-primary'
    }
  ];
  });

  // Get user's recent requests
  recentRequests = computed(() => {
    const userId = this.dataService.currentUser().id;
    return this.dataService.getRequestsByCitizenId(userId)
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  });

  onRequestCreated(request: CollectionRequest): void {
    // Request is already added to DataService, just refresh the view
    console.log('New request created:', request);
    // The computed signals will automatically update
    }
  }
