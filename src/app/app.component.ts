import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FlashMessagesComponent } from './shared/components/flash-messages/flash-messages.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FlashMessagesComponent],
  template: `
    <div class="min-h-screen flex flex-col transition-colors duration-300">
      <app-navbar></app-navbar>
      <app-flash-messages></app-flash-messages>
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'lovable-eco';
}

