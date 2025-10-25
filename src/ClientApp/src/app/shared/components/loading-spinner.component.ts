import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center items-center" [ngClass]="containerClass">
      <div class="text-center">
        <div 
          class="animate-spin rounded-full border-b-2 border-blue-600 mx-auto"
          [ngClass]="sizeClass"
        ></div>
        @if (message) {
          <p class="mt-4 text-gray-600">{{ message }}</p>
        }
      </div>
    </div>
  `,
  styles: []
})
export class LoadingSpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() message: string = '';
  @Input() containerClass: string = 'h-64';

  get sizeClass(): string {
    switch (this.size) {
      case 'sm':
        return 'h-6 w-6';
      case 'lg':
        return 'h-16 w-16';
      default:
        return 'h-12 w-12';
    }
  }
}
