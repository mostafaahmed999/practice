import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <span [class]="getClasses()">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      border-radius: 9999px;
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 500;
      transition: colors 0.2s;
    }
    :host .default {
      background-color: hsl(var(--primary));
      color: hsl(var(--primary-foreground));
    }
    :host .secondary {
      background-color: hsl(var(--secondary));
      color: hsl(var(--secondary-foreground));
    }
    :host .destructive {
      background-color: hsl(var(--destructive));
      color: hsl(var(--destructive-foreground));
    }
  `]
})
export class BadgeComponent {
  @Input() variant: 'default' | 'secondary' | 'destructive' = 'default';
  @Input() className = '';

  getClasses(): string {
    const classes = [this.variant, this.className];
    return classes.filter(Boolean).join(' ');
  }
}

