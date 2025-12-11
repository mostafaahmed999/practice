import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { DataService } from '../../core/services/data.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../shared/ui/card/card.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';
import { BadgeDisplayComponent } from '../../shared/ui/badge-display/badge-display.component';
import { PointHistoryItemComponent } from '../../shared/ui/point-history-item/point-history-item.component';

@Component({
  selector: 'app-rewards',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    BadgeComponent,
    BadgeDisplayComponent,
    PointHistoryItemComponent
  ],
  template: `
    <div class="min-h-screen py-8 px-4 md:px-6 lg:px-8 pb-24 md:pb-8">
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-foreground">{{ t('rewards') }}</h1>
            <p class="text-muted-foreground mt-2">Redeem your points for exciting rewards</p>
          </div>
        </div>

        <!-- Points Summary -->
        <div class="grid md:grid-cols-3 gap-6">
          <app-card class="shadow-md">
            <app-card-content class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-muted-foreground mb-1">{{ t('totalPoints') }}</p>
                  <p class="text-4xl font-bold text-primary">{{ currentUser().points }}</p>
                </div>
                <span class="text-5xl">🎁</span>
              </div>
            </app-card-content>
          </app-card>

          <app-card class="shadow-md">
            <app-card-content class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-muted-foreground mb-1">This Month</p>
                  <p class="text-4xl font-bold text-accent">+{{ monthlyPoints() }}</p>
                </div>
                <span class="text-5xl">📈</span>
              </div>
            </app-card-content>
          </app-card>

          <app-card class="shadow-md">
            <app-card-content class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-muted-foreground mb-1">Level</p>
                  <p class="text-4xl font-bold text-primary capitalize">{{ currentUser().level }}</p>
                </div>
                <span class="text-5xl">⭐</span>
              </div>
            </app-card-content>
          </app-card>
        </div>

        <!-- Badges Section -->
        <app-card class="shadow-md">
          <app-card-header>
            <app-card-title class="text-2xl">🏆 Your Badges</app-card-title>
            <app-card-description>Earn badges by completing recycling goals</app-card-description>
          </app-card-header>
          <app-card-content>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              @for (badge of badges(); track badge.id) {
                <app-badge-display
                  [badge]="badge"
                ></app-badge-display>
              }
            </div>
          </app-card-content>
        </app-card>

        <!-- Rewards Grid -->
        <div>
          <h2 class="text-2xl font-bold mb-4">{{ t('redeemRewards') }}</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (reward of rewards(); track reward.id) {
            <app-card
              [class]="'shadow-md hover:shadow-lg transition-all ' + (!reward.available ? 'opacity-60' : '')"
            >
              <app-card-content class="p-6">
                <div class="text-5xl mb-4 text-center">{{ reward.icon }}</div>
                <h3 class="text-xl font-bold mb-2 text-center">{{ reward.title }}</h3>
                <p class="text-sm text-muted-foreground mb-4 text-center">{{ reward.description }}</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl font-bold text-primary">{{ reward.points }}</span>
                    <span class="text-sm text-muted-foreground">points</span>
                  </div>
                  <app-badge [variant]="reward.category === 'popular' ? 'default' : 'secondary'">
                    {{ reward.category }}
                  </app-badge>
                </div>
                <app-button
                  [disabled]="!reward.available || currentUser().points < reward.points"
                  [variant]="reward.available && currentUser().points >= reward.points ? 'default' : 'outline'"
                  class="w-full mt-4"
                  (onClick)="redeemReward(reward.id)"
                >
                  {{ reward.available && currentUser().points >= reward.points ? 'Redeem Now' : 'Not Available' }}
                </app-button>
              </app-card-content>
            ></app-card>
            }
          </div>
        </div>

        <!-- Point History -->
        <app-card class="shadow-md">
          <app-card-header>
            <app-card-title class="text-2xl">{{ t('pointHistory') }}</app-card-title>
            <app-card-description>Track your point earnings and redemptions</app-card-description>
          </app-card-header>
          <app-card-content>
            <div class="space-y-3">
              @for (history of pointHistory(); track history.id) {
                <app-point-history-item
                  [history]="history"
                ></app-point-history-item>
              }
              @if (pointHistory().length === 0) {
                <div class="text-center py-8 text-muted-foreground">
                  <span class="text-4xl block mb-2">📊</span>
                  <p>No point history yet</p>
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
export class RewardsComponent {
  languageService = inject(LanguageService);
  dataService = inject(DataService);
  
  t = (key: string) => this.languageService.t(key);

  // Get data from service
  currentUser = computed(() => this.dataService.currentUser());
  badges = computed(() => this.dataService.badges());
  rewards = computed(() => this.dataService.rewards());
  pointHistory = computed(() => this.dataService.pointHistory());

  monthlyPoints = computed(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return this.pointHistory()
      .filter(h => {
        const historyDate = new Date(h.date);
        return historyDate.getMonth() === currentMonth && 
               historyDate.getFullYear() === currentYear &&
               h.type === 'earned';
      })
      .reduce((sum, h) => sum + h.points, 0);
  });

  redeemReward(rewardId: number): void {
    const success = this.dataService.redeemReward(rewardId);
    if (success) {
      // Show success message
      console.log('Reward redeemed successfully!');
    } else {
      // Show error message
      alert('Unable to redeem reward. Check if you have enough points or if the reward is available.');
    }
  }
}
