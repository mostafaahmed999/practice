import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from '../../../shared/ui/stat-card/stat-card.component';

interface Stat {
  id: string;
  icon: string;
  label: string;
  value: string;
  change: string;
  color: string;
}

@Component({
  selector: 'app-citizen-stats-cards',
  standalone: true,
  imports: [CommonModule, StatCardComponent],
  templateUrl: './stats-cards.component.html',
  styleUrl: './stats-cards.component.css'
})
export class CitizenStatsCardsComponent {
  @Input() stats: Stat[] = [];
}
