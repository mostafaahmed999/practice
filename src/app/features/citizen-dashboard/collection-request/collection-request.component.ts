import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { CollectionRequest } from '../../../core/models/collection-request.model';
import { CreateCollectionModalComponent } from '../../../shared/components/create-collection-modal/create-collection-modal.component';

@Component({
  selector: 'app-citizen-collection-request',
  standalone: true,
  imports: [CommonModule, CreateCollectionModalComponent],
  templateUrl: './collection-request.component.html',
  styleUrl: './collection-request.component.css'
})
export class CitizenCollectionRequestComponent {
  @Input() modalOpen = false;
  @Output() modalOpenChange = new EventEmitter<boolean>();
  @Output() requestCreated = new EventEmitter<CollectionRequest>();

  languageService = inject(LanguageService);
  
  t = (key: string) => this.languageService.t(key);

  onOpenChange(open: boolean): void {
    this.modalOpenChange.emit(open);
  }

  onRequestCreated(request: CollectionRequest): void {
    this.requestCreated.emit(request);
  }
}
