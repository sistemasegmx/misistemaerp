import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({ selector: '[appEnterAsTab]' })
export class EnterAsTabDirective {
  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent) {
    if (!['Enter', 'Tab'].includes(event.key)) return;
    event.preventDefault();

    const elements = Array.from(this.el.nativeElement.querySelectorAll('input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button.btn-primary')) as HTMLElement[];
    const index = elements.indexOf(event.target as HTMLElement);
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;

    if (event.shiftKey && index > 0) return this.focusAndSelect(elements[index - 1]);
    if (this.isInvalid(target)) return this.showFieldError(target);
    if (index < elements.length - 1) this.focusAndSelect(elements[index + 1]);
  }

  @HostListener('focusin', ['$event'])
  handleFocus(event: FocusEvent) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) { setTimeout(() => target.select(), 100); }
  }

  private isInvalid(target: HTMLInputElement | HTMLTextAreaElement): boolean {
    return (target.hasAttribute('required') && !target.value.trim()) || (target.type === 'number' && target.hasAttribute('required') && isNaN(parseFloat(target.value.replace(',', '.'))));
  }

  private showFieldError(target: HTMLElement) {
    target.classList.add('error-blink');
    setTimeout(() => target.classList.remove('error-blink'), 1000);
    target.focus();
  }

  private focusAndSelect(element: HTMLElement) {
    setTimeout(() => { element.focus(); if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) element.select(); }, 0);
  }
}
