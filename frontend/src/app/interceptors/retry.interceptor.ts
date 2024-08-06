// src/app/interceptors/retry.interceptor.ts

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, delay, concatMap } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.url.includes('/orderSummary')) {
      return next.handle(req);
    }
    
    return next.handle(req).pipe(
      retry({ count: 5, delay: 1000 }),
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP Error:', error);
        return throwError(() => new Error(error.message));
      })
    );
  }
}

