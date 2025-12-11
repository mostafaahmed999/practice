import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, CardContentComponent } from '../card/card.component';
import { Stat } from '../../../core/models/stat.model';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CardComponent, CardContentComponent],
  template: `
    <app-card [className]="'shadow-md hover:shadow-lg transition-shadow ' + (className || '')">
      <app-card-content class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground mb-1">{{ stat.label }}</p>
            <p [class]="'text-3xl font-bold ' + stat.color">{{ stat.value }}</p>
            <p class="text-xs text-muted-foreground mt-1">{{ stat.change }}</p>
          </div>
          <span class="text-3xl">{{ stat.icon }}</span>
        </div>
      </app-card-content>
    </app-card>
  `,
  styles: []
})
export class StatCardComponent {
  @Input({ required: true }) stat!: Stat;
  @Input() className?: string;
}

