import { Component, inject, ChangeDetectionStrategy, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../../core/services/language.service';
import { UserService } from '../../core/services/user.service';
import { UserDataService } from '../../core/services/user-data.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../shared/ui/card/card.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    BadgeComponent
  ],
  template: `
    <div class="min-h-screen py-8 px-4 md:px-6 lg:px-8 pb-24 md:pb-8">
      <div class="max-w-4xl mx-auto space-y-8">
        <!-- Header -->
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-foreground">{{ t('profile') }}</h1>
          <p class="text-muted-foreground mt-2">Manage your account information</p>
        </div>

        <!-- Profile Card -->
        <app-card class="shadow-md">
          <app-card-content class="p-6">
            <div class="flex flex-col sm:flex-row items-center gap-6">
              <div class="relative">
                <div class="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center overflow-hidden">
                  @if (previewAvatar() || profileData()?.avatar) {
                    <img [src]="previewAvatar() || profileData()?.avatar" [alt]="profileData()?.fullName || 'User'" class="w-full h-full object-cover">
                  } @else {
                    <span class="text-white text-4xl">👤</span>
                  }
                </div>
                @if (isEditMode()) {
                  <input 
                    type="file" 
                    #fileInput
                    (change)="onAvatarSelected($event)"
                    accept="image/*"
                    class="hidden"
                  />
                  <button 
                    type="button"
                    (click)="fileInput.click()"
                    class="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <span class="text-white text-sm">📷</span>
                  </button>
                }
              </div>
              <div class="text-center sm:text-start flex-1">
                <h2 class="text-2xl font-bold text-card-foreground">{{ computedFullName() }}</h2>
                <div class="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                  @for (role of userService.roles(); track role) {
                  <app-badge
                    [variant]="role === userService.currentRole() ? 'default' : 'secondary'"
                    class="capitalize"
                  >
                    @if (role === userService.currentRole()) {
                      <span>⭐</span>
                    }
                    {{ role }}
                  </app-badge>
                  }
                </div>
              </div>
              <app-button variant="outline" class="gap-2" (click)="toggleEditMode()">
                <span>{{ isEditMode() ? '❌' : '✏️' }}</span>
                {{ isEditMode() ? 'Cancel' : 'Edit Profile' }}
              </app-button>
            </div>
          </app-card-content>
        </app-card>

        <!-- Account Information -->
        <app-card class="shadow-md">
          <app-card-header>
            <app-card-title>Account Information</app-card-title>
            <app-card-description>Your personal details</app-card-description>
          </app-card-header>
          <app-card-content class="space-y-6">
            <!-- View Mode -->
            @if (!isEditMode()) {
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label for="viewFirstName" class="text-sm font-medium">First Name</label>
                    <input id="viewFirstName" [value]="profileData()?.firstName || 'Not provided'" readonly class="w-full px-3 py-2 border border-input rounded-md bg-muted" />
                  </div>
                  <div class="space-y-2">
                    <label for="viewLastName" class="text-sm font-medium">Last Name</label>
                    <input id="viewLastName" [value]="profileData()?.lastName || 'Not provided'" readonly class="w-full px-3 py-2 border border-input rounded-md bg-muted" />
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label for="viewEmail" class="flex items-center gap-2 text-sm font-medium">
                      <span>📧</span>
                      Email
                    </label>
                    <input id="viewEmail" [value]="profileData()?.email || 'Not provided'" readonly class="w-full px-3 py-2 border border-input rounded-md bg-muted" />
                  </div>
                  <div class="space-y-2">
                    <label for="viewPhone" class="flex items-center gap-2 text-sm font-medium">
                      <span>📞</span>
                      Phone
                    </label>
                    <input id="viewPhone" [value]="profileData()?.phoneNumber || 'Not provided'" readonly class="w-full px-3 py-2 border border-input rounded-md bg-muted" />
                  </div>
                </div>
                
                <div class="space-y-2">
                  <label for="viewAddress" class="flex items-center gap-2 text-sm font-medium">
                    <span>🏠</span>
                    Address
                  </label>
                  <input id="viewAddress" [value]="profileData()?.address || 'Not provided'" readonly class="w-full px-3 py-2 border border-input rounded-md bg-muted" />
                  
                  <!-- Leaflet Map Container in View Mode -->
                  <div class="rounded-lg overflow-hidden border border-border shadow-sm h-80 relative mt-4">
                    <div id="view-address-map" class="w-full h-full"></div>
                  </div>
                  
                  <!-- Coordinates Display -->
                  @if (currentCoordinates(); as coords) {
                    <div class="bg-muted p-2 rounded-md text-xs text-muted-foreground text-center mt-2">
                      📍 Lat: {{ coords.lat | number:'1.4-4' }} | Lng: {{ coords.lng | number:'1.4-4' }}
                    </div>
                  }
                </div>
              </div>
            } @else {
              <!-- Edit Mode -->
              <form [formGroup]="editForm!" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label for="editFirstName" class="text-sm font-medium">First Name</label>
                    <input 
                      id="editFirstName" 
                      formControlName="firstName"
                      placeholder="Enter your first name"
                      (input)="onFirstNameInput($event)"
                      class="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                    @if (editForm!.get('firstName')?.errors?.['required'] && editForm!.get('firstName')?.touched) {
                      <p class="text-xs text-destructive">First name is required</p>
                    }
                  </div>
                  <div class="space-y-2">
                    <label for="editLastName" class="text-sm font-medium">Last Name</label>
                    <input 
                      id="editLastName" 
                      formControlName="lastName"
                      placeholder="Enter your last name"
                      (input)="onLastNameInput($event)"
                      class="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                    @if (editForm!.get('lastName')?.errors?.['required'] && editForm!.get('lastName')?.touched) {
                      <p class="text-xs text-destructive">Last name is required</p>
                    }
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label for="editEmail" class="flex items-center gap-2 text-sm font-medium">
                      <span>📧</span>
                      Email (Read-only)
                    </label>
                    <input 
                      id="editEmail" 
                      formControlName="email"
                      readonly
                      class="w-full px-3 py-2 border border-input rounded-md bg-muted" 
                    />
                  </div>
                  <div class="space-y-2">
                    <label for="editPhone" class="flex items-center gap-2 text-sm font-medium">
                      <span>📞</span>
                      Phone
                    </label>
                    <input 
                      id="editPhone" 
                      formControlName="phoneNumber"
                      placeholder="Enter your phone number"
                      class="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary" 
                    />
                  </div>
                </div>
                
                <div class="space-y-2">
                  <label for="editAddress" class="flex items-center gap-2 text-sm font-medium">
                    <span>🏠</span>
                    Address
                  </label>
                  <input 
                    id="editAddress" 
                    formControlName="address"
                    placeholder="Enter your address or select from map"
                    (input)="onAddressInput($event)"
                    class="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary" 
                  />
                  @if (addressSuggestions().length > 0) {
                    <div class="border border-input rounded-md bg-background shadow-md max-h-48 overflow-y-auto">
                      @for (suggestion of addressSuggestions(); track suggestion.osm_id) {
                        <button 
                          type="button"
                          (click)="selectAddressSuggestion(suggestion)"
                          class="w-full text-left px-3 py-2 hover:bg-muted border-b border-border last:border-b-0 text-sm transition-colors"
                        >
                          {{ suggestion.address.town || suggestion.address.city || suggestion.name }}
                          <br/>
                          <span class="text-xs text-muted-foreground">{{ suggestion.display_name }}</span>
                        </button>
                      }
                    </div>
                  }
                  
                  <!-- Leaflet Map Container -->
                  <div class="rounded-lg overflow-hidden border border-border shadow-sm h-80 relative mt-4">
                    <div id="address-map" class="w-full h-full"></div>
                    <div class="absolute top-2 left-2 bg-white/90 backdrop-blur px-3 py-2 rounded-md shadow-sm text-xs text-muted-foreground z-10">
                      📍 Click map to select location
                    </div>
                  </div>
                  
                  <!-- Coordinates Display -->
                  @if (currentCoordinates(); as coords) {
                    <div class="bg-muted p-2 rounded-md text-xs text-muted-foreground text-center mt-2">
                      📍 Lat: {{ coords.lat | number:'1.4-4' }} | Lng: {{ coords.lng | number:'1.4-4' }}
                    </div>
                  }
                </div>
              </form>
            }
            
            <!-- Save Button (Edit Mode) -->
            @if (isEditMode()) {
              <div class="flex gap-3 pt-4">
                <app-button 
                  class="flex-1 gap-2"
                  (click)="saveProfile()"
                  [disabled]="!editForm!.valid || isSaving()"
                >
                  @if (isSaving()) {
                    <span class="inline-flex items-center gap-2">
                      <span class="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-r-transparent"></span>
                      Saving...
                    </span>
                  } @else {
                    <span>✅</span>
                    <span>Save Changes</span>
                  }
                </app-button>
              </div>
            }
          </app-card-content>
        </app-card>

        <!-- Security -->
        <app-card class="shadow-md">
          <app-card-header>
            <app-card-title class="flex items-center gap-2">
              <span>🛡️</span>
              Security
            </app-card-title>
            <app-card-description>Manage your account security</app-card-description>
          </app-card-header>
          <app-card-content class="space-y-4">
            <div class="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p class="font-medium text-card-foreground">Password</p>
                <p class="text-sm text-muted-foreground">Last changed 30 days ago</p>
              </div>
              <app-button variant="outline">Change Password</app-button>
            </div>
            <div class="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p class="font-medium text-card-foreground">Two-Factor Authentication</p>
                <p class="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <app-button variant="outline">Enable</app-button>
            </div>
          </app-card-content>
        </app-card>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  languageService = inject(LanguageService);
  userService = inject(UserService);
  userDataService = inject(UserDataService);
  private fb = inject(FormBuilder);
  private httpClient = inject(HttpClient);

  // Signals
  profileData = this.userDataService.userData;
  isEditMode = signal(false);
  isSaving = signal(false);
  previewAvatar = signal<string | null>(null);
  mapAddress = signal<string>('');
  addressSuggestions = signal<any[]>([]);
  isGeocodingLoading = signal(false);
  currentCoordinates = signal<{ lat: number; lng: number } | null>(null);
  editFirstName = signal<string>('');
  editLastName = signal<string>('');
  
  // Computed full name from firstName and lastName
  computedFullName = computed(() => {
    const first = this.editFirstName();
    const last = this.editLastName();
    return first && last ? `${first} ${last}`.trim() : this.profileData()?.fullName || 'User';
  });
  
  private mapInstance: any = null;
  private mapMarker: any = null;
  
  // Form
  editForm: FormGroup | null = null;

  t = (key: string) => this.languageService.t(key);

  ngOnInit(): void {
    // Initialize form
    this.initializeForm();
    // Initialize view mode map
    setTimeout(() => {
      this.initializeViewMap();
    }, 0);
  }

  private initializeForm(): void {
    this.editForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: [''],
      phoneNumber: [''],
      address: ['']
    });

    // Populate form with current data
    const currentData = this.profileData();
    if (currentData) {
      const nameParts = (currentData.fullName || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      this.editForm.patchValue({
        firstName: firstName,
        lastName: lastName,
        email: currentData.email || '',
        phoneNumber: currentData.phoneNumber || '',
        address: currentData.address || ''
      });
      
      // Set map address
      if (currentData.address) {
        this.mapAddress.set(currentData.address);
      }
    }
  }

  toggleEditMode(): void {
    this.isEditMode.update(v => !v);
    if (this.isEditMode()) {
      // Populate signals and form when entering edit mode
      const currentData = this.profileData();
      if (currentData) {
        const nameParts = (currentData.fullName || '').split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Update signals
        this.editFirstName.set(firstName);
        this.editLastName.set(lastName);
        
        // Update form controls
        this.editForm?.patchValue({
          firstName: firstName,
          lastName: lastName,
          email: currentData.email || '',
          phoneNumber: currentData.phoneNumber || '',
          address: currentData.address || ''
        });
        
        // Update map address
        if (currentData.address) {
          this.mapAddress.set(currentData.address);
        }
      }
      
      // Initialize map after DOM is rendered
      setTimeout(() => {
        this.initializeMap();
      }, 0);
    } else {
      // Reset form when canceling
      this.previewAvatar.set(null);
      this.addressSuggestions.set([]);
      this.editFirstName.set('');
      this.editLastName.set('');
      this.mapInstance = null;
      this.mapMarker = null;
      this.initializeForm();
      
      // Re-initialize view mode map
      setTimeout(() => {
        this.initializeViewMap();
      }, 0);
    }
  }

  onAddressInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.editForm?.get('address')?.setValue(input);
    
    if (input.length > 2) {
      this.searchAddresses(input);
    } else {
      this.addressSuggestions.set([]);
    }
  }

  onFirstNameInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.editFirstName.set(value);
    this.editForm?.get('firstName')?.setValue(value);
  }

  onLastNameInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.editLastName.set(value);
    this.editForm?.get('lastName')?.setValue(value);
  }

  private searchAddresses(query: string): void {
    this.isGeocodingLoading.set(true);
    
    // Use Nominatim API (OpenStreetMap)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`;
    
    this.httpClient.get<any[]>(url).subscribe({
      next: (results) => {
        this.addressSuggestions.set(results || []);
        this.isGeocodingLoading.set(false);
      },
      error: (err) => {
        console.error('Geocoding error:', err);
        this.isGeocodingLoading.set(false);
      }
    });
  }

  selectAddressSuggestion(suggestion: any): void {
    const displayName = suggestion.display_name || suggestion.name;
    this.editForm?.get('address')?.setValue(displayName);
    this.mapAddress.set(displayName);
    this.addressSuggestions.set([]);
    
    // Update map to show selected location
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    this.updateMapMarker(lat, lng);
  }

  onMapAddressInput(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.mapAddress.set(input);
    this.editForm?.get('address')?.setValue(input);
    
    // Optional: Search for address as user types
    if (input.length > 2) {
      this.searchAddresses(input);
    } else {
      this.addressSuggestions.set([]);
    }
  }

  onAvatarSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error('Image size must be less than 5MB');
      return;
    }

    // Convert to base64 for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      this.previewAvatar.set(base64);
    };
    reader.readAsDataURL(file);
  }

  saveProfile(): void {
    if (!this.editForm || this.editForm.invalid) return;

    this.isSaving.set(true);

    const formValue = this.editForm.value;
    const fullName = `${formValue.firstName} ${formValue.lastName}`.trim();
    const updatedData: any = {
      fullName: fullName,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      address: formValue.address || this.mapAddress(),
      avatar: this.previewAvatar() || this.profileData()?.avatar || ''
    };

    if (this.currentCoordinates()) {
      updatedData.coordinates = this.currentCoordinates();
    }

    this.userDataService.setUserData(updatedData);

    setTimeout(() => {
      this.isSaving.set(false);
      this.isEditMode.set(false);
      this.previewAvatar.set(null);
      this.addressSuggestions.set([]);
    }, 500);
  }

  private updateMapMarker(lat: number, lng: number): void {
    if (!this.mapInstance) return;

    // Update marker position
    if (this.mapMarker) {
      this.mapMarker.setLatLng([lat, lng]);
    }

    // Update map view
    this.mapInstance.setView([lat, lng], 13);

    // Update coordinates signal
    this.currentCoordinates.set({ lat, lng });

    // Perform reverse geocoding to get address
    this.reverseGeocode(lat, lng);
  }

  private reverseGeocode(lat: number, lng: number): void {
    this.isGeocodingLoading.set(true);
    
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    
    this.httpClient.get<any>(url).subscribe({
      next: (result) => {
        const address = result.address?.road ? 
          `${result.address.road}, ${result.address.city || result.address.town || ''}` :
          result.display_name;
        
        this.mapAddress.set(address);
        this.editForm?.get('address')?.setValue(address);
        this.isGeocodingLoading.set(false);
      },
      error: (err) => {
        console.error('Reverse geocoding error:', err);
        this.isGeocodingLoading.set(false);
      }
    });
  }

  private initializeViewMap(): void {
    // Dynamically import Leaflet for view mode
    import('leaflet').then((L) => {
      const mapElement = document.getElementById('view-address-map');
      if (!mapElement) return;

      // Default location based on stored address or Riyadh
      let defaultLat = 24.7136;
      let defaultLng = 46.6753;

      // Check if there's a stored address/coordinates
      const currentData = this.profileData();
      if (currentData?.coordinates) {
        defaultLat = currentData.coordinates.lat;
        defaultLng = currentData.coordinates.lng;
      }

      // Create map
      const mapInstance = L.map('view-address-map').setView([defaultLat, defaultLng], 13);

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstance);

      // Add non-draggable marker
      L.marker([defaultLat, defaultLng], {
        draggable: false,
        title: 'Your Location'
      }).addTo(mapInstance);
    }).catch((err) => {
      console.error('Failed to load Leaflet:', err);
    });
  }

  private initializeMap(): void {
    // Dynamically import Leaflet
    import('leaflet').then((L) => {
      const mapElement = document.getElementById('address-map');
      if (!mapElement) return;
      
      // Clear existing map if it exists
      if (this.mapInstance) {
        this.mapInstance.remove();
        this.mapInstance = null;
        this.mapMarker = null;
      }

      // Default location based on stored address or Riyadh
      let defaultLat = 24.7136;
      let defaultLng = 46.6753;

      // Check if there's a stored address/coordinates
      const currentData = this.profileData();
      if (currentData?.coordinates) {
        defaultLat = currentData.coordinates.lat;
        defaultLng = currentData.coordinates.lng;
      }

      // Create map
      this.mapInstance = L.map('address-map').setView([defaultLat, defaultLng], 13);

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(this.mapInstance);

      // Add marker
      this.mapMarker = L.marker([defaultLat, defaultLng], {
        draggable: this.isEditMode(),
        title: 'Your Location'
      }).addTo(this.mapInstance);

      // Store initial coordinates
      this.currentCoordinates.set({ lat: defaultLat, lng: defaultLng });

      // Update coordinates when marker is dragged
      this.mapMarker.on('dragend', () => {
        const newLat = this.mapMarker.getLatLng().lat;
        const newLng = this.mapMarker.getLatLng().lng;
        this.updateMapMarker(newLat, newLng);
      });

      // Handle map clicks to add/move marker
      this.mapInstance.on('click', (e: any) => {
        if (this.isEditMode()) {
          const lat = e.latlng.lat;
          const lng = e.latlng.lng;
          this.updateMapMarker(lat, lng);
        }
      });
    }).catch((err) => {
      console.error('Failed to load Leaflet:', err);
    });
  }
}
