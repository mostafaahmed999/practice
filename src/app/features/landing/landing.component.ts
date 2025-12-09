import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
// Icons will be handled via SVG or simple text for now

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <div class="min-h-screen pb-20 md:pb-0">
      <section class="py-12 md:py-20 px-4 md:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div [class]="'grid md:grid-cols-2 gap-8 md:gap-12 items-center ' + (direction() === 'rtl' ? 'md:grid-flow-dense' : '')">
            <div [class]="'space-y-6 text-center md:text-start ' + (direction() === 'rtl' ? 'md:col-start-2' : '')">
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                {{ t('heroTitle') }}
              </h1>
              <p class="text-lg md:text-xl text-muted-foreground">{{ t('heroSubtitle') }}</p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a routerLink="/register">
                  <app-button size="lg" class="text-lg px-8">{{ t('getStarted') }}</app-button>
                </a>
                <a routerLink="#features">
                  <app-button variant="outline" size="lg" class="text-lg px-8">{{ t('learnMore') }}</app-button>
                </a>
              </div>
            </div>
            <div [class]="direction() === 'rtl' ? 'md:col-start-1' : ''">
              <div class="w-full max-w-lg mx-auto rounded-2xl shadow-lg bg-gradient-to-br from-primary/20 to-primary/5 p-12 flex items-center justify-center">
                <div class="h-48 w-48 text-primary opacity-50 text-8xl">♻</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" class="py-12 md:py-20 px-4 md:px-6 lg:px-8 bg-muted/30">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold mb-4 text-foreground">Why Choose EcoCollect?</h2>
          </div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let feature of features; let i = index" class="p-6 hover:shadow-lg transition-all bg-card rounded-lg border border-border">
              <div class="bg-primary-light p-3 rounded-xl w-fit mb-4">
                <span class="text-primary text-xl">{{ getIconEmoji(feature.icon) }}</span>
              </div>
              <h3 class="text-lg font-semibold mb-2 text-card-foreground">{{ feature.title }}</h3>
              <p class="text-muted-foreground text-sm">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class LandingComponent {
  languageService = inject(LanguageService);
  
  direction = this.languageService.direction;
  t = (key: string) => this.languageService.t(key);

  features: Feature[] = [
    { icon: 'Recycle', title: 'Easy Collection Requests', description: 'Schedule pickups for your recyclable materials with just a few clicks.' },
    { icon: 'MapPin', title: 'Smart Route Planning', description: 'Our collectors use optimized routes to reduce emissions.' },
    { icon: 'Gift', title: 'Earn Rewards', description: 'Get rewarded for your recycling efforts with points.' },
    { icon: 'TrendingUp', title: 'Track Your Impact', description: 'Monitor your environmental contribution with detailed analytics.' },
    { icon: 'Users', title: 'Community Driven', description: 'Join thousands of eco-conscious citizens making a difference.' },
    { icon: 'Leaf', title: 'Sustainable Future', description: 'Be part of the solution for a greener tomorrow.' }
  ];

  getIconEmoji(icon: string): string {
    const iconMap: { [key: string]: string } = {
      'Recycle': '♻',
      'MapPin': '📍',
      'Gift': '🎁',
      'TrendingUp': '📈',
      'Users': '👥',
      'Leaf': '🌿'
    };
    return iconMap[icon] || '●';
  }
}

