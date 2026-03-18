import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { StatsService } from '@/core/services/stats';

describe('StatsService', () => {
  let service: StatsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StatsService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(StatsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('doit récupérer les statistiques de synthèse', () => {
    const response = {
      total: 5,
      todo: 2,
      inProgress: 1,
      done: 2,
    };

    service.getOverview().subscribe((value) => {
      expect(value).toEqual(response);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/stats/overview`);
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });
});
