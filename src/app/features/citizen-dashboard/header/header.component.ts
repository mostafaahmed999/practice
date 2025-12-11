import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

@Component({
  selector: 'app-citizen-header',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class CitizenHeaderComponent {
  @Output() createRequestClick = new EventEmitter<void>();
  
  languageService = inject(LanguageService);
  
  t = (key: string) => this.languageService.t(key);

  onCreateRequestClick(): void {
    this.createRequestClick.emit();
  }
}
