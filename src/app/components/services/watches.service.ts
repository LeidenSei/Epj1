import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';

export interface Watch {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  price: number;
  discount: number | null;
  description: string;
  features: string[];
  specifications: {
    movement: string;
    caseSize: string;
    waterResistance: string;
    material: string;
    features: string[];
  };
  images: string[];
  inStock: boolean;
  warranty: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
}

@Injectable({
  providedIn: 'root'
})
export class WatchesService {
  private dataUrl = 'assets/data/alberto-clocks-data.json';
  private watchesData: Observable<any> | null = null;

  constructor(private http: HttpClient) { }

  private getData(): Observable<any> {
    if (!this.watchesData) {
      this.watchesData = this.http.get<any>(this.dataUrl).pipe(
        catchError(error => {
          console.error('Error fetching watch data', error);
          return throwError('Failed to load watch data. Please try again later.');
        }),
        shareReplay(1)
      );
    }
    return this.watchesData;
  }

  getAllWatches(): Observable<Watch[]> {
    return this.getData().pipe(
      map(data => data.products)
    );
  }

  getWatchesByCategory(categoryId: string): Observable<Watch[]> {
    return this.getData().pipe(
      map(data => data.products.filter((product: Watch) => product.categoryId === categoryId))
    );
  }

  getWatchById(watchId: string): Observable<Watch> {
    return this.getData().pipe(
      map(data => {
        const watch = data.products.find((product: Watch) => product.id === watchId);
        if (!watch) {
          throw new Error(`Watch with ID ${watchId} not found`);
        }
        return watch;
      }),
      catchError(error => {
        console.error('Error getting watch by ID', error);
        return throwError(error);
      })
    );
  }

  getAllCategories(): Observable<Category[]> {
    return this.getData().pipe(
      map(data => data.categories)
    );
  }

  getCategoryById(categoryId: string): Observable<Category> {
    return this.getData().pipe(
      map(data => {
        const category = data.categories.find((cat: Category) => cat.id === categoryId);
        if (!category) {
          throw new Error(`Category with ID ${categoryId} not found`);
        }
        return category;
      }),
      catchError(error => {
        console.error('Error getting category by ID', error);
        return throwError(error);
      })
    );
  }

  getFeaturedWatches(limit: number = 6): Observable<Watch[]> {
    return this.getData().pipe(
      map(data => {
        const discountedWatches = data.products.filter((watch: Watch) => watch.discount !== null);

        if (discountedWatches.length >= limit) {
          return discountedWatches.slice(0, limit);
        }

        const otherWatches = data.products
          .filter((watch: Watch) => watch.discount === null)
          .slice(0, limit - discountedWatches.length);
          
        return [...discountedWatches, ...otherWatches];
      })
    );
  }

  getWatchesByPriceRange(minPrice: number, maxPrice: number): Observable<Watch[]> {
    return this.getData().pipe(
      map(data => {
        return data.products.filter((watch: Watch) => {
          const actualPrice = watch.discount 
            ? watch.price * (1 - watch.discount / 100) 
            : watch.price;
            
          return actualPrice >= minPrice && actualPrice <= maxPrice;
        });
      })
    );
  }

  searchWatches(query: string): Observable<Watch[]> {
    if (!query.trim()) {
      return of([]);
    }
    
    const searchTerm = query.toLowerCase().trim();
    return this.getData().pipe(
      map(data => {
        return data.products.filter((watch: Watch) => 
          watch.name.toLowerCase().includes(searchTerm) || 
          watch.brand.toLowerCase().includes(searchTerm) ||
          watch.description.toLowerCase().includes(searchTerm)
        );
      })
    );
  }

  getRelatedWatches(watchId: string, limit: number = 4): Observable<Watch[]> {
    return this.getData().pipe(
      map(data => {
        const currentWatch = data.products.find((w: Watch) => w.id === watchId);
        if (!currentWatch) {
          return [];
        }
        
        const sameCategory = data.products.filter((w: Watch) => 
          w.categoryId === currentWatch.categoryId && w.id !== watchId
        );
        
        if (sameCategory.length >= limit) {
          return sameCategory.slice(0, limit);
        }
        
        const sameBrand = data.products.filter((w: Watch) => 
          w.brand === currentWatch.brand && 
          w.id !== watchId && 
          !sameCategory.some(c => c.id === w.id)
        );
        
        const related = [...sameCategory, ...sameBrand];
        
        if (related.length < limit) {
          const remaining = data.products.filter((w: Watch) => 
            w.id !== watchId && 
            !related.some(r => r.id === w.id)
          ).slice(0, limit - related.length);
          
          return [...related, ...remaining];
        }
        
        return related.slice(0, limit);
      })
    );
  }
}