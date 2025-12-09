import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p class="text-muted-foreground">Dashboard content coming soon...</p>
    </div>
  `,
  styles: []
})
export class AdminDashboardComponent {
}

