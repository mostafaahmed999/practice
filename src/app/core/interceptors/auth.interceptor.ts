import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FlashMessageService } from '../services/flash-message.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private flash = inject(FlashMessageService);
  private auth = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.flash.showError("يجب تسجيل الدخول مرة أخرى");
          this.router.navigate(['/login']);
        }

        if (error.status === 403) {
          this.flash.showError("غير مصرح لك بالدخول");
        }

        if (error.status === 0) {
          this.flash.showError("لا يمكن الاتصال بالسيرفر");
        }

        return throwError(() => error);
      })
    );
  }
}
