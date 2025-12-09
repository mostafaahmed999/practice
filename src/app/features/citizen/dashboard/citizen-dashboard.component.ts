import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { DataService } from '../../core/services/data.service';
import { UserService } from '../../core/services/user.service';
import { CollectionRequest } from '../../core/models/collection-request.model';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { StatCardComponent } from '../../shared/ui/stat-card/stat-card.component';
import { RequestCardComponent } from '../../shared/ui/request-card/request-card.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../shared/ui/card/card.component';
import { CreateCollectionModalComponent } from '../../shared/components/create-collection-modal/create-collection-modal.component';

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
  template: `
    <div class="min-h-screen py-8 px-6 lg:px-8">
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Header -->
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-4xl font-bold text-foreground">{{ t('citizenDashboard') }}</h1>
            <p class="text-muted-foreground mt-2">Track your recycling journey and environmental impact</p>
          </div>
          <app-button (onClick)="modalOpen.set(true)" size="lg" class="gap-2 shadow-md">
            <span>➕</span>
            {{ t('createRequest') }}
          </app-button>
        </div>

        <!-- Collection Request Modal -->
        <app-create-collection-modal 
          [open]="modalOpen()" 
          (openChange)="modalOpen.set($event)"
          (requestCreated)="onRequestCreated($event)"
        ></app-create-collection-modal>

        <!-- Stats Cards -->
        <div class="grid md:grid-cols-3 gap-6">
          <app-stat-card *ngFor="let stat of stats()" [stat]="stat"></app-stat-card>
        </div>

        <!-- Recent Requests -->
        <app-card class="shadow-md">
          <app-card-header>
            <app-card-title class="text-2xl">{{ t('recentRequests') }}</app-card-title>
            <app-card-description>Your recycling activity history</app-card-description>
          </app-card-header>
          <app-card-content>
            <div class="space-y-4">
              <app-request-card
                *ngFor="let request of recentRequests()"
                [request]="request"
                [clickable]="false"
                [showActions]="false"
              ></app-request-card>
              @if (recentRequests().length === 0) {
                <div class="text-center py-8 text-muted-foreground">
                  <span class="text-4xl block mb-2">📦</span>
                  <p>No requests yet. Create your first collection request!</p>
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
