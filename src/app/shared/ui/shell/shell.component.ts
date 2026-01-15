import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ThemeService } from '../../../core/services/theme.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';



type NavItem = {
  label: string;
  icon: string;
  route: string;
};

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatSlideToggleModule,
    AsyncPipe,
    NgFor,
    NgIf,
  ],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  private readonly bp = inject(BreakpointObserver);

  // Mobile breakpoint: < 960px (Material "md")
  readonly isHandset$ = this.bp.observe('(max-width: 959px)').pipe(
    map((r) => r.matches),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly nav: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Customers', icon: 'groups', route: '/customers' },
    { label: 'Leads', icon: 'person_add', route: '/leads' },
    { label: 'Deals', icon: 'paid', route: '/deals' },
    { label: 'Tasks', icon: 'checklist', route: '/tasks' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ];

  readonly theme = inject(ThemeService);
  
async closeIfHandset(drawer: MatSidenav): Promise<void> {
  const isHandset = await firstValueFrom(this.isHandset$);
  if (isHandset) drawer.close();
}

  toggleTheme(): void {
    this.theme.toggle();
  }
  
}
