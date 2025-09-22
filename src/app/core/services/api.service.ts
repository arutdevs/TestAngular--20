import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = `${'https://localhost:7134'}/api`;

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  getBlob(endpoint: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${endpoint}`, {
      responseType: 'blob',
    });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data);
  }
  postBlob(endpoint: string, data: any): Observable<Blob> {
    return this.http.post(`${this.baseUrl}${endpoint}`, data, {
      responseType: 'blob',
    });
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }

  getWithOptions<T>(endpoint: string, params?: any, headers?: HttpHeaders): Observable<T> {
    const options = {
      params: new HttpParams({ fromObject: params || {} }),
      headers,
    };
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, options);
  }

  // post<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<T> {
  //   return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, { headers });
  // }

  // put<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<T> {
  //   return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data, { headers });
  // }

  // patch<T>(endpoint: string, data: any, headers?: HttpHeaders): Observable<T> {
  //   return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, data, { headers });
  // }

  // delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
  //   return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, { headers });
  // }
}
