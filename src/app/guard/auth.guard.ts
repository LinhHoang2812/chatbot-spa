import { Injectable, inject } from '@angular/core';
import { CanActivateChildFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../admin/services/auth.service';
import { Observable, map, tap } from 'rxjs';

export const authGuard: CanActivateChildFn = (
  route,
  state
): Observable<boolean | UrlTree> | boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return authService.checkToken(token).pipe(
      map((value) => {
        if (value == false) {
          localStorage.removeItem('token');
          router.navigateByUrl('/admin/auth');
          return false;
        } else {
          authService.saveToken(token);
          return true;
        }
      })
    );
  } else {
    router.navigateByUrl('/admin/auth');
    return false;
  }
};
