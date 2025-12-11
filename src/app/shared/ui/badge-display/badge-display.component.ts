import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Badge } from '../../../core/models/reward.model';

@Component({
  selector: 'app-badge-display',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div
      [class]="'p-4 rounded-lg border-2 text-center transition-all ' + (badge.earned ? 'border-primary bg-primary/10' : 'border-border bg-muted/30 opacity-60') + ' ' + (className || '')"
    >
      <div class="text-4xl mb-2">{{ badge.icon }}</div>
      <p class="font-medium text-sm mb-1">{{ badge.name }}</p>
      <p class="text-xs text-muted-foreground">{{ badge.description }}</p>
      @if (badge.earned && badge.earnedDate) {
        <p class="text-xs text-primary mt-2">Earned: {{ badge.earnedDate }}</p>
      }
    </div>
  `,
  styles: []
})
export class BadgeDisplayComponent {
  @Input({ required: true }) badge!: Badge;
  @Input() className?: string;
}

