import { Component, inject } from "@angular/core";
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { ThemeService } from "../../services/theme.service";

@Component({
    selector: "app-dashboard-page",
    templateUrl: "./dashboard-page.component.html",
    styleUrls: ['./dashboard-page.component.scss'],
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
})
export default class DashboardPageComponent {
    public router = inject(Router);
    public themeService = inject(ThemeService);
}