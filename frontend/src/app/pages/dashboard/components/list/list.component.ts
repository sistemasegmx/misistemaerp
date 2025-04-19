import { Component, Input, OnInit, } from '@angular/core';
import { ISale } from "src/app/pages/interfaces/isale";

interface payload {
  [key: string]: any;
}
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  standalone: false,
})
export class ListComponent {

  @Input() isLoading: boolean;
  @Input() title: string;
  @Input() items: ISale[];
  @Input() actionsLink: string;

  truncateText(text: string | null | undefined, limit = 80): string { return !text ? '' : text.length > limit ? text.substring(0, limit) + '...' : text; }

  getStatusClass(status: string): string { return `badge-light-${status}`; }
}
