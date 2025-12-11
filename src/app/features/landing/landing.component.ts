import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { LandingFeaturesComponent } from './components/features/features.component';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, ButtonComponent, LandingFeaturesComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
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
}

