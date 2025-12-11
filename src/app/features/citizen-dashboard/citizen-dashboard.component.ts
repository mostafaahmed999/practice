import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { DataService } from '../../core/services/data.service';
import { CollectionRequest } from '../../core/models/collection-request.model';
import { CitizenHeaderComponent } from './header/header.component';
import { CitizenCollectionRequestComponent } from './collection-request/collection-request.component';
import { CitizenStatsCardsComponent } from './stats-cards/stats-cards.component';
import { CitizenRecentRequestsComponent } from './recent-requests/recent-requests.component';

@Component({
  selector: 'app-citizen-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CitizenHeaderComponent,
    CitizenCollectionRequestComponent,
    CitizenStatsCardsComponent,
    CitizenRecentRequestsComponent
  ],
  templateUrl: './citizen-dashboard.component.html',
  styleUrl: './citizen-dashboard.component.css'
})
export class CitizenDashboardComponent {
  languageService = inject(LanguageService);
  dataService = inject(DataService);
  
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
        value: String(user?.totalCollections || 0),
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
        value: String(user?.points || 0),
        change: 'Redeem now',
        color: 'text-primary'
      }
    ];
  });

  // Get user's recent requests
  recentRequests = computed(() => {
    const user = this.dataService.currentUser();
    const userId = user?.id;
    if (!userId) return [];
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
