import { Component, inject, computed } from '@angular/core';
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
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css']
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
