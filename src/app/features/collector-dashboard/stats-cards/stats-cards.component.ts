import { Component, computed, inject } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { StatCardComponent } from '../../../shared/ui/stat-card/stat-card.component';

@Component({
  selector: 'app-collector-stats-cards',
  standalone: true,
  imports: [StatCardComponent],
  templateUrl: './stats-cards.component.html',
  styleUrl: './stats-cards.component.css'
})
export class CollectorStatsCardsComponent {
  dataService = inject(DataService);
  collectorId = 1;

  stats = computed(() => {
    const baseStats = this.dataService.userStats();
    const activeRoutesCount = this.dataService.getRequestsByCollectorId(this.collectorId)
      .filter(r => r.status === 'in-progress').length;
    
    return baseStats.map(stat => {
      if (stat.id === 'active-routes') {
        return {
          ...stat,
          value: String(activeRoutesCount)
        };
      }
      return stat;
    });
  });
}
