import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '@/core/services/auth';
import { authInterceptor } from '@/core/interceptors/auth-interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authService: { getToken: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authService = { getToken: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService as unknown as AuthService },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('doit ajouter le jeton bearer quand il est présent', () => {
    authService.getToken.mockReturnValue('jwt-token');

    http.get('/api/me').subscribe();

    const req = httpMock.expectOne('/api/me');
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-token');
    req.flush({});
  });

  it('ne doit pas ajouter le jeton bearer quand il est absent', () => {
    authService.getToken.mockReturnValue(null);

    http.get('/api/me').subscribe();

    const req = httpMock.expectOne('/api/me');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
