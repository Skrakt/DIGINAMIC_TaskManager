import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '@env/environment';

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

const TOKEN_STORAGE_KEY = 'task_manager_access_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly httpClient: HttpClient) {}

  login(loginRequestPayload: LoginDto) {
    return this.httpClient
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, loginRequestPayload)
      .pipe(tap((authenticationResponse) => this.setToken(authenticationResponse.accessToken)));
  }

  setToken(accessToken: string) {
    localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  clearToken() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}
