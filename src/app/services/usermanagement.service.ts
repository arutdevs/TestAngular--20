// usermanagement.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';

// JSONPlaceholder User interface
export interface JsonPlaceholderUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}


@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private http = inject(HttpClient);
  private baseUrl = 'https://jsonplaceholder.typicode.com';

  // httpResource approach
  getUsersResource() {
    return httpResource<JsonPlaceholderUser[]>(() => ({
      url: `${this.baseUrl}/users`,
      method: 'GET',
    }));
  }
}