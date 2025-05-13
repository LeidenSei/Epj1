import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';

export interface Company {
  name: string;
  slogan: string;
  founded: number;
  description: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  openingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

export interface Statistics {
  yearsInBusiness: number;
  watchesRepaired: number;
  brandsAvailable: number;
  satisfiedCustomers: number;
  visitorsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private dataUrl = 'assets/data/alberto-clocks-data.json';
  private companyData: Observable<any> | null = null;

  constructor(private http: HttpClient) { }

  private getData(): Observable<any> {
    if (!this.companyData) {
      this.companyData = this.http.get<any>(this.dataUrl).pipe(
        catchError(error => {
          console.error('Error fetching company data', error);
          return throwError('Failed to load company data. Please try again later.');
        }),
        shareReplay(1)
      );
    }
    return this.companyData;
  }

  // Get company information
  getCompanyInfo(): Observable<Company> {
    return this.getData().pipe(
      map(data => data.company)
    );
  }
  
  // Get company statistics
  getStatistics(): Observable<Statistics> {
    return this.getData().pipe(
      map(data => data.statistics)
    );
  }
  
  // Get visitor count
  getVisitorCount(): Observable<number> {
    return this.getData().pipe(
      map(data => data.statistics.visitorsCount)
    );
  }

  // Update visitor count (in a real application, this would interact with a backend)
  incrementVisitorCount(): Observable<number> {
    return this.getData().pipe(
      map(data => {
        // In a real application, this would be a POST request to update the counter
        // For this demo, we'll just return the incremented value without actually changing it
        return data.statistics.visitorsCount + 1;
      })
    );
  }
  
  // Get company founding year
  getFoundingYear(): Observable<number> {
    return this.getData().pipe(
      map(data => data.company.founded)
    );
  }
  
  // Get years in business
  getYearsInBusiness(): Observable<number> {
    return this.getData().pipe(
      map(data => data.statistics.yearsInBusiness)
    );
  }
  
  // Get social media links
  getSocialMediaLinks(): Observable<{[key: string]: string}> {
    return this.getData().pipe(
      map(data => data.company.socialMedia)
    );
  }
  
  // Get contact information
  getContactInfo(): Observable<{email: string; phone: string; address: string}> {
    return this.getData().pipe(
      map(data => data.company.contact)
    );
  }
  
  // Get opening hours
  getOpeningHours(): Observable<{weekdays: string; saturday: string; sunday: string}> {
    return this.getData().pipe(
      map(data => data.company.openingHours)
    );
  }
}