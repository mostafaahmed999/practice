import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing-features',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css'
})
export class LandingFeaturesComponent {
  @Input() features: Feature[] = [];

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
