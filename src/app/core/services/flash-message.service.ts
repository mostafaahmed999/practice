import { Injectable, signal } from '@angular/core';

export interface FlashMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class FlashMessageService {
  messages = signal<FlashMessage[]>([]);

  showSuccess(message: string) {
    this.addMessage(message, 'success');
  }

  showError(message: string) {
    this.addMessage(message, 'error');
  }

  showInfo(message: string) {
    this.addMessage(message, 'info');
  }

  showWarning(message: string) {
    this.addMessage(message, 'warning');
  }

  private addMessage(message: string, type: FlashMessage['type']) {
    const id = Date.now().toString();
    const newMessage: FlashMessage = { type, message, id };
    
    this.messages.update(msgs => [...msgs, newMessage]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      this.removeMessage(id);
    }, 3000);
  }

  removeMessage(id: string) {
    this.messages.update(msgs => msgs.filter(m => m.id !== id));
  }

  clear() {
    this.messages.set([]);
  }
}
