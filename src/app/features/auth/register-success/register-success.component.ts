import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-success',
  standalone: true,
  templateUrl: './register-success.html',
  styleUrls: ['./register-success.css']
})
export class RegisterSuccessComponent {
  private router = inject(Router);

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
