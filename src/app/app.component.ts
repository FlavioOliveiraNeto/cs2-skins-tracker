import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NgxPaginationModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cs2-skins-tracker';
  showBackButton: boolean = true;

  constructor(private location: Location, private router: Router) {
    this.router.events.subscribe(() => {
      const currentRoute: string | undefined = this.router.routerState.snapshot.root.firstChild?.component?.name.replace("_", "");
      this.showBackButton = !(currentRoute == "LoginComponent");
    });
  }

  returnShowBackButton(): boolean {
    return this.showBackButton;
  }

  goBack(): void {
    this.location.back();
  }
}
