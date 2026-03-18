import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

export interface CategoryItem {
  _id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private readonly http: HttpClient) {}

  getCategories() {
    return this.http.get<CategoryItem[]>(`${environment.apiUrl}/categories`);
  }
}
