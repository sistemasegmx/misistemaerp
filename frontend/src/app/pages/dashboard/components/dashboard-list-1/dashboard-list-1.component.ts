import { Component, Input, OnInit } from "@angular/core";
import { IEnte } from "src/app/pages/interfaces/iente";
import { EntesFromQuotes } from "../../dashboard.component";

@Component({
  selector: "app-dashboard-list-1",
  standalone: false,
  templateUrl: "./dashboard-list-1.component.html",
  styleUrl: "./list.component.css"
})
export class DashboardList1Component {

  @Input() title: string;
  @Input() items: EntesFromQuotes[];
  @Input() isLoading: boolean;

  getStatusClass(status: string): string { return `badge-light-${status}`; }
}
