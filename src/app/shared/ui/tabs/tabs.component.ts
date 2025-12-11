import { Component, Input, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div [class]="className || ''">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class TabsComponent {
  @Input() defaultValue = '';
  @Input() className = '';
  selectedTab = signal(this.defaultValue);

  constructor() {
    effect(() => {
      // Update all child components when selectedTab changes
      if (typeof document !== 'undefined') {
        const triggers = document.querySelectorAll('app-tabs-trigger');
        const contents = document.querySelectorAll('app-tabs-content');
        triggers.forEach((trigger: any) => {
          if (trigger.componentInstance) {
            trigger.componentInstance.isActive = trigger.componentInstance.value === this.selectedTab();
          }
        });
        contents.forEach((content: any) => {
          if (content.componentInstance) {
            content.componentInstance.isActive = content.componentInstance.value === this.selectedTab();
          }
        });
      }
    });
  }
}

@Component({
  selector: 'app-tabs-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div [class]="'flex items-center justify-center rounded-md bg-muted p-1 ' + (className || '')">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class TabsListComponent {
  @Input() className = '';
}

@Component({
  selector: 'app-tabs-trigger',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <button
      [class]="'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ' + (isActive ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-background/50') + ' ' + (className || '')"
      (click)="select()"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: []
})
export class TabsTriggerComponent {
  @Input() value = '';
  @Input() className = '';
  @Input() isActive = false;
  @Input() onSelect?: () => void;

  select(): void {
    if (this.onSelect) {
      this.onSelect();
    }
  }
}

@Component({
  selector: 'app-tabs-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    @if (isActive) {
      <div [class]="'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' + (className || '')">
        <ng-content></ng-content>
      </div>
    }
  `,
  styles: []
})
export class TabsContentComponent {
  @Input() value = '';
  @Input() className = '';
  @Input() isActive = false;
}

