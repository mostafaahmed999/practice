import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FlashMessageService } from '../../../core/services/flash-message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-email.html',
  styleUrls: ['./confirm-email.css']
})
export class ConfirmEmailComponent {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private flash = inject(FlashMessageService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  status: 'success' | 'error' | 'loading' = 'loading';

  ngOnInit() {
    const email = this.route.snapshot.queryParamMap.get('email');
    const rawToken = this.route.snapshot.queryParamMap.get('token');

    if (!email || !rawToken) {
      this.status = 'error';
      this.cdr.detectChanges();
      return;
    }

    this.auth.confirmEmail(email, rawToken).subscribe({
      next: () => {
        this.status = 'success';
        this.flash.showSuccess("Email confirmed successfully ✔");
        this.cdr.detectChanges();
      },
      error: () => {
        this.status = 'error';
        this.cdr.detectChanges();
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
