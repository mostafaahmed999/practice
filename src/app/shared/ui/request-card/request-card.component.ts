import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionRequest } from '../../../core/models/collection-request.model';
import { BadgeComponent } from '../badge/badge.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-request-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, BadgeComponent, ButtonComponent],
  template: `
    <div
      [class]="'p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors ' + (clickable ? 'cursor-pointer' : '') + ' ' + (className || '')"
      (click)="clickable && onCardClick.emit(request)"
    >
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h3 class="font-medium text-card-foreground mb-1">{{ request.material }}</h3>
          @if (request.citizenName) {
            <p class="text-sm text-muted-foreground">{{ request.citizenName }}</p>
          }
        </div>
        <app-badge [variant]="getBadgeVariant(request.status)">
          {{ getStatusText(request.status) }}
        </app-badge>
      </div>
      
      <div class="flex items-center gap-4 text-sm text-muted-foreground mb-3">
        @if (request.location) {
          <span class="flex items-center gap-1">
            <span>📍</span>
            {{ request.location }}
          </span>
        }
        @if (request.distance) {
          <span class="flex items-center gap-1">
            <span>📏</span>
            {{ request.distance }}
          </span>
        }
        @if (request.weight) {
          <span class="flex items-center gap-1">
            <span>⚖️</span>
            {{ request.weight }}
          </span>
        }
        @if (request.date) {
          <span class="flex items-center gap-1">
            <span>📅</span>
            {{ request.date }}
          </span>
        }
      </div>

      @if (request.estimatedArrivalTime && request.status === 'in-progress') {
        <div class="p-2 bg-primary/10 rounded-md border border-primary/20 mb-3">
          <div class="flex items-center gap-2">
            <span class="text-primary">🚛</span>
            <div>
              <p class="text-xs text-muted-foreground">Estimated Arrival</p>
              <p class="text-sm font-medium text-primary">{{ formatArrivalTime(request.estimatedArrivalTime) }}</p>
            </div>
            @if (request.routeOrder) {
              <div class="ml-auto">
                <span class="text-xs text-muted-foreground">Stop #{{ request.routeOrder }}</span>
              </div>
            }
          </div>
        </div>
      }

      @if (showActions && request.status === 'pending') {
        <app-button
          variant="default"
          size="sm"
          class="w-full"
          (onClick)="onAccept.emit(request); $event.stopPropagation()"
        >
          Accept Request
        </app-button>
      }
    </div>
  `,
  styles: []
})
export class RequestCardComponent {
  @Input({ required: true }) request!: CollectionRequest;
  @Input() showActions = false;
  @Input() clickable = true;
  @Input() className?: string;
  
  @Output() onCardClick = new EventEmitter<CollectionRequest>();
  @Output() onAccept = new EventEmitter<CollectionRequest>();

  getBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'pending':
        return 'destructive';
      default:
        return 'secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return 'Cancelled';
    }
  }

  formatArrivalTime(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    
    if (diffMins < 0) {
      return 'Arrived';
    } else if (diffMins < 60) {
      return `In ${diffMins} minutes`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      if (mins === 0) {
        return `In ${hours} hour${hours > 1 ? 's' : ''}`;
      }
      return `In ${hours}h ${mins}m`;
    }
  }
}

