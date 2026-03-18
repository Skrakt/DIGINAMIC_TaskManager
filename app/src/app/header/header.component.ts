import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '@/core/services/auth';
import { DialogConfirmComponent } from '@shared/dialog-confirm';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, MatToolbarModule, MatButtonModule, MatDialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
  ) {}

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  askForLogoutConfirmation() {
    this.dialog
      .open(DialogConfirmComponent, {
        data: {
          title: 'Confirmation',
          message: 'Souhaitez-vous vous déconnecter ?',
          confirmText: 'Oui',
          cancelText: 'Non',
        },
      })
      .afterClosed()
      .subscribe((isConfirmed: boolean) => {
        if (!isConfirmed) {
          return;
        }
        this.authService.clearToken();
        this.router.navigateByUrl('/home').then(() => {
          this.refreshPage();
        });
      });
  }

  private refreshPage() {
    window.location.reload();
  }

  handleAuthenticationAction() {
    if (this.isAuthenticated) {
      this.askForLogoutConfirmation();
      return;
    }
    this.router.navigateByUrl('/login');
  }
}
