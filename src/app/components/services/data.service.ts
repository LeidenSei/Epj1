import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { Category, Watch } from './watches.service';
import { Company, Statistics } from './company.service';
import { StoreLocation } from './store-locator.service';
import { Technology } from './technology.service';
import { FAQ } from './faq.service';
import { Testimonial } from './testimonial.service';
import { WatchService } from './service.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl = 'assets/data/alberto-clocks-data.json';
  private allData: Observable<any> | null = null;

  constructor(private http: HttpClient) { }

  private getData(): Observable<any> {
    if (!this.allData) {
      this.allData = this.http.get<any>(this.dataUrl).pipe(
        catchError(error => {
          console.error('Error fetching data', error);
          return throwError('Failed to load data. Please try again later.');
        }),
        shareReplay(1)
      );
    }
    return this.allData;
  }

  getAllData(): Observable<any> {
    return this.getData();
  }

  getSection<T>(section: string): Observable<T> {
    return this.getData().pipe(
      map(data => {
        if (!data[section]) {
          throw new Error(`Section "${section}" not found in data`);
        }
        return data[section] as T;
      }),
      catchError(error => {
        console.error(`Error getting section ${section}`, error);
        return throwError(error);
      })
    );
  }

  getHomePageData(): Observable<{
    featuredWatches: Watch[],
    categories: Category[],
    company: Company,
    statistics: Statistics,
    testimonials: Testimonial[]
  }> {
    return this.getData().pipe(
      map(data => {
        const featuredWatches = data.products.slice(0, 6);
        
        return {
          featuredWatches,
          categories: data.categories,
          company: data.company,
          statistics: data.statistics,
          testimonials: data.testimonials
        };
      })
    );
  }
  
  getProductListPageData(): Observable<{
    products: Watch[],
    categories: Category[]
  }> {
    return this.getData().pipe(
      map(data => {
        return {
          products: data.products,
          categories: data.categories
        };
      })
    );
  }
  
  getProductDetailPageData(productId: string): Observable<{
    product: Watch,
    relatedProducts: Watch[],
    category: Category
  }> {
    return this.getData().pipe(
      map(data => {
        const product = data.products.find((p: Watch) => p.id === productId);
        
        if (!product) {
          throw new Error(`Product with ID ${productId} not found`);
        }
        
        const category = data.categories.find((c: Category) => c.id === product.categoryId);
        
        const relatedProducts = data.products
          .filter((p: Watch) => p.categoryId === product.categoryId && p.id !== productId)
          .slice(0, 4);
          
        return {
          product,
          category,
          relatedProducts
        };
      }),
      catchError(error => {
        console.error('Error getting product detail data', error);
        return throwError(error);
      })
    );
  }
  
  getSupportPageData(): Observable<{
    faqs: FAQ[],
    services: WatchService[]
  }> {
    return this.getData().pipe(
      map(data => {
        return {
          faqs: data.faqs,
          services: data.services
        };
      })
    );
  }
  
  getTechnologyPageData(): Observable<{
    technologies: Technology[]
  }> {
    return this.getData().pipe(
      map(data => {
        return {
          technologies: data.technologies
        };
      })
    );
  }
  
  getStoreLocatorPageData(): Observable<any> {
    return this.http.get(this.dataUrl);
  }
  getGalleryData(): Observable<any> {
    return this.http.get<any>(this.dataUrl);
  }
  getContactPageData(): Observable<any> {
    return this.http.get<any>(this.dataUrl);
  }
}