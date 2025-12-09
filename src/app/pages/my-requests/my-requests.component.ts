import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { DataService } from '../../core/services/data.service';
import { UserService } from '../../core/services/user.service';
import { CollectionRequest, RequestStatus } from '../../models/collection-request.model';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { RequestCardComponent } from '../../shared/ui/request-card/request-card.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../shared/ui/card/card.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';
import { CreateCollectionModalComponent } from '../../components/create-collection-modal/create-collection-modal.component';
import { TabsListComponent, TabsTriggerComponent, TabsContentComponent } from '../../shared/ui/tabs/tabs.component';

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
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
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
