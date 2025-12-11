import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <button
      [class]="getClasses()"
      [type]="type"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    button {
      @apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50;
    }
    button.default {
      @apply bg-primary text-primary-foreground hover:opacity-90;
    }
    button.outline {
      @apply border border-input bg-background hover:bg-accent hover:text-accent-foreground;
    }
    button.ghost {
      @apply hover:bg-muted hover:text-foreground;
    }
    button.sm {
      @apply h-9 px-3;
    }
    button.lg {
      @apply h-11 px-8;
    }
    button.icon {
      @apply h-10 w-10;
    }
  `]
})
export class ButtonComponent {
  @Input() variant: 'default' | 'outline' | 'ghost' = 'default';
  @Input() size: 'sm' | 'lg' | 'icon' | 'default' = 'default';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<MouseEvent>();

  getClasses(): string {
    const classes = [this.variant, this.size !== 'default' ? this.size : ''];
    return classes.filter(Boolean).join(' ');
  }
}

