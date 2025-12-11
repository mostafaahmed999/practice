import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-collector-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class CollectorHeaderComponent {
  languageService = inject(LanguageService);
  t = (key: string) => this.languageService.t(key);
}
