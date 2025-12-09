import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Settings</h1>
      <p class="text-muted-foreground">Settings page coming soon...</p>
    </div>
  `,
  styles: []
})
export class SettingsComponent {
}

