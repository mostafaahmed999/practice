import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { DataService } from '../../../core/services/data.service';
import { UserService } from '../../../core/services/user.service';
import { CollectionRequest, RequestStatus } from '../../../core/models/collection-request.model';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { RequestCardComponent } from '../../../shared/ui/request-card/request-card.component';
import { CardComponent, CardContentComponent } from '../../../shared/ui/card/card.component';
import { CreateCollectionModalComponent } from '../../../shared/components/create-collection-modal/create-collection-modal.component';
import { TabsListComponent, TabsTriggerComponent, TabsContentComponent } from '../../../shared/ui/tabs/tabs.component';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    RequestCardComponent,
    CardComponent,
    CardContentComponent,
    CreateCollectionModalComponent,
    TabsListComponent,
    TabsTriggerComponent,
    TabsContentComponent
  ],
  template: `
    <div class="min-h-screen py-8 px-4 md:px-6 lg:px-8 pb-24 md:pb-8">
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-foreground">{{ t('myRequests') }}</h1>
            <p class="text-muted-foreground mt-2">Manage your collection requests</p>
          </div>
          <app-button (onClick)="modalOpen.set(true)" class="gap-2 w-full sm:w-auto">
            <span>➕</span>
            {{ t('createRequest') }}
          </app-button>
        </div>

        <app-create-collection-modal 
          [open]="modalOpen()" 
          (openChange)="modalOpen.set($event)"
          (requestCreated)="onRequestCreated($event)"
        ></app-create-collection-modal>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <app-card>
            <app-card-content class="p-4 text-center">
              <div class="text-2xl font-bold text-primary">{{ userRequests().length }}</div>
              <p class="text-sm text-muted-foreground">Total Requests</p>
            </app-card-content>
          </app-card>
          <app-card>
            <app-card-content class="p-4 text-center">
              <div class="text-2xl font-bold text-primary">{{ completedCount() }}</div>
              <p class="text-sm text-muted-foreground">{{ t('completed') }}</p>
            </app-card-content>
          </app-card>
          <app-card>
            <app-card-content class="p-4 text-center">
              <div class="text-2xl font-bold text-accent">{{ inProgressCount() }}</div>
              <p class="text-sm text-muted-foreground">{{ t('inProgress') }}</p>
            </app-card-content>
          </app-card>
          <app-card>
            <app-card-content class="p-4 text-center">
              <div class="text-2xl font-bold text-muted-foreground">{{ pendingCount() }}</div>
              <p class="text-sm text-muted-foreground">{{ t('pending') }}</p>
            </app-card-content>
          </app-card>
        </div>

        <!-- Tabs -->
        <div class="w-full">
          <app-tabs-list class="grid w-full grid-cols-5 mb-6">
            <app-tabs-trigger [value]="'all'" [isActive]="selectedTab() === 'all'" (onSelect)="selectedTab.set('all')">All</app-tabs-trigger>
            <app-tabs-trigger [value]="'pending'" [isActive]="selectedTab() === 'pending'" (onSelect)="selectedTab.set('pending')">{{ t('pending') }}</app-tabs-trigger>
            <app-tabs-trigger [value]="'in-progress'" [isActive]="selectedTab() === 'in-progress'" (onSelect)="selectedTab.set('in-progress')">{{ t('inProgress') }}</app-tabs-trigger>
            <app-tabs-trigger [value]="'completed'" [isActive]="selectedTab() === 'completed'" (onSelect)="selectedTab.set('completed')">{{ t('completed') }}</app-tabs-trigger>
            <app-tabs-trigger [value]="'cancelled'" [isActive]="selectedTab() === 'cancelled'" (onSelect)="selectedTab.set('cancelled')">{{ t('cancelled') }}</app-tabs-trigger>
          </app-tabs-list>

          <app-tabs-content [value]="'all'" [isActive]="selectedTab() === 'all'" class="space-y-4">
            @for (request of filteredRequests(); track request.id) {
            <app-request-card
              [request]="request"
              [clickable]="false"
              [showActions]="false"
            ></app-request-card>
            }
            @if (filteredRequests().length === 0) {
              <app-card>
                <app-card-content class="p-8 text-center">
                  <span class="text-4xl mb-4 block">📦</span>
                  <p class="text-muted-foreground">No requests found</p>
                </app-card-content>
              </app-card>
            }
          </app-tabs-content>

          <app-tabs-content [value]="'pending'" [isActive]="selectedTab() === 'pending'" class="space-y-4">
            @for (request of getRequestsByStatus('pending'); track request.id) {
            <app-request-card
              [request]="request"
              [clickable]="false"
              [showActions]="false"
            ></app-request-card>
            }
            @if (getRequestsByStatus('pending').length === 0) {
              <app-card>
                <app-card-content class="p-8 text-center">
                  <span class="text-4xl mb-4 block">⏳</span>
                  <p class="text-muted-foreground">No pending requests</p>
                </app-card-content>
              </app-card>
            }
          </app-tabs-content>

          <app-tabs-content [value]="'in-progress'" [isActive]="selectedTab() === 'in-progress'" class="space-y-4">
            @for (request of getRequestsByStatus('in-progress'); track request.id) {
            <app-request-card
              [request]="request"
              [clickable]="false"
              [showActions]="false"
            ></app-request-card>
            }
            @if (getRequestsByStatus('in-progress').length === 0) {
              <app-card>
                <app-card-content class="p-8 text-center">
                  <span class="text-4xl mb-4 block">🔄</span>
                  <p class="text-muted-foreground">No in-progress requests</p>
                </app-card-content>
              </app-card>
            }
          </app-tabs-content>

          <app-tabs-content [value]="'completed'" [isActive]="selectedTab() === 'completed'" class="space-y-4">
            @for (request of getRequestsByStatus('completed'); track request.id) {
            <app-request-card
              [request]="request"
              [clickable]="false"
              [showActions]="false"
            ></app-request-card>
            }
            @if (getRequestsByStatus('completed').length === 0) {
              <app-card>
                <app-card-content class="p-8 text-center">
                  <span class="text-4xl mb-4 block">✅</span>
                  <p class="text-muted-foreground">No completed requests</p>
                </app-card-content>
              </app-card>
            }
          </app-tabs-content>

          <app-tabs-content [value]="'cancelled'" [isActive]="selectedTab() === 'cancelled'" class="space-y-4">
            @for (request of getRequestsByStatus('cancelled'); track request.id) {
            <app-request-card
              [request]="request"
              [clickable]="false"
              [showActions]="false"
            ></app-request-card>
            }
            @if (getRequestsByStatus('cancelled').length === 0) {
              <app-card>
                <app-card-content class="p-8 text-center">
                  <span class="text-4xl mb-4 block">❌</span>
                  <p class="text-muted-foreground">No cancelled requests</p>
                </app-card-content>
              </app-card>
            }
          </app-tabs-content>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MyRequestsComponent {
  languageService = inject(LanguageService);
  dataService = inject(DataService);
  userService = inject(UserService);
  
  selectedTab = signal<string>('all');
  modalOpen = signal(false);

  t = (key: string) => this.languageService.t(key);

  // Get user's requests
  userRequests = computed(() => {
    const userId = this.dataService.currentUser().id;
    return this.dataService.getRequestsByCitizenId(userId);
  });

  filteredRequests = computed(() => {
    const tab = this.selectedTab();
    if (tab === 'all') {
      return this.userRequests();
    }
    return this.getRequestsByStatus(tab as RequestStatus);
  });

  completedCount = computed(() => 
    this.userRequests().filter(r => r.status === 'completed').length
  );

  inProgressCount = computed(() => 
    this.userRequests().filter(r => r.status === 'in-progress').length
  );

  pendingCount = computed(() => 
    this.userRequests().filter(r => r.status === 'pending').length
  );

  getRequestsByStatus(status: RequestStatus): CollectionRequest[] {
    return this.userRequests().filter(r => r.status === status);
  }

  onRequestCreated(request: CollectionRequest): void {
    // Request is already added to DataService, just refresh the view
    console.log('New request created:', request);
    // The computed signals will automatically update
    // Optionally switch to the pending tab to show the new request
    this.selectedTab.set('pending');
  }
}
