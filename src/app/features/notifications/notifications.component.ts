import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Notifications</h1>
      <div class="space-y-4">
        <div
          *ngFor="let notification of notificationService.notifications()"
          class="p-4 bg-card rounded-lg border border-border"
        >
          <h3 class="font-semibold">{{ notification.title }}</h3>
          <p class="text-muted-foreground text-sm">{{ notification.message }}</p>
          <p class="text-xs text-muted-foreground mt-2">{{ notification.time }}</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class NotificationsComponent {
  notificationService = inject(NotificationService);
}

