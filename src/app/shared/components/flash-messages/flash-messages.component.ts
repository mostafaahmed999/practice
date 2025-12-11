import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashMessageService } from '../../../core/services/flash-message.service';

@Component({
  selector: 'app-flash-messages',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      @for (message of flashService.messages(); track message.id) {
        <div
          [class]="getMessageClasses(message.type)"
          class="p-4 rounded-lg shadow-lg border animate-fade-up transition-all duration-300"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="text-lg">{{ getIcon(message.type) }}</span>
              <span class="text-sm font-medium">{{ message.message }}</span>
            </div>
            <button
              (click)="flashService.removeMessage(message.id)"
              class="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      pointer-events: none;
    }

    div[class*='message'] {
      pointer-events: auto;
    }
  `]
})
export class FlashMessagesComponent {
  flashService = inject(FlashMessageService);

  getMessageClasses(type: string): string {
    const baseClasses = 'bg-card text-card-foreground border';
    const typeClasses: Record<string, string> = {
      success: 'bg-success/10 text-success border-success/30',
      error: 'bg-destructive/10 text-destructive border-destructive/30',
      info: 'bg-primary/10 text-primary border-primary/30',
      warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30'
    };
    return typeClasses[type] || baseClasses;
  }

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: '✔️',
      error: '❌',
      info: 'ℹ️',
      warning: '⚠️'
    };
    return icons[type] || '📢';
  }
}
