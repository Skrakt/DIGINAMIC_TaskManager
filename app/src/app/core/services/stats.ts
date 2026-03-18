import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

export interface StatsOverview {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
}

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  constructor(private readonly http: HttpClient) {}

  getOverview() {
    return this.http.get<StatsOverview>(`${environment.apiUrl}/stats/overview`);
  }
}
