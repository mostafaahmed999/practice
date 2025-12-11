import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointHistory } from '../../../core/models/reward.model';

@Component({
  selector: 'app-point-history-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between p-4 border border-border rounded-lg">
      <div class="flex items-center gap-4">
        <span [class]="'text-2xl ' + (history.type === 'earned' ? 'text-green-500' : 'text-red-500')">
          {{ history.type === 'earned' ? '➕' : '➖' }}
        </span>
        <div>
          <p class="font-medium">{{ history.action }}</p>
          <p class="text-sm text-muted-foreground">{{ history.date }}</p>
        </div>
      </div>
      <span [class]="'font-bold ' + (history.type === 'earned' ? 'text-green-500' : 'text-red-500')">
        {{ history.type === 'earned' ? '+' : '-' }}{{ history.points }}
      </span>
    </div>
  `,
  styles: []
})
export class PointHistoryItemComponent {
  @Input({ required: true }) history!: PointHistory;
}

