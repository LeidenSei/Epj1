import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';

export interface Testimonial {
  id: number;
  name: string;
  title: string;
  image: string;
  quote: string;
}

@Injectable({
  providedIn: 'root'
})
export class TestimonialsService {
  private dataUrl = 'assets/data/alberto-clocks-data.json';
  private testimonialData: Observable<any> | null = null;

  constructor(private http: HttpClient) { }

  private getData(): Observable<any> {
    if (!this.testimonialData) {
      this.testimonialData = this.http.get<any>(this.dataUrl).pipe(
        catchError(error => {
          console.error('Error fetching testimonial data', error);
          return throwError('Failed to load testimonial data. Please try again later.');
        }),
        shareReplay(1)
      );
    }
    return this.testimonialData;
  }

  // Get all testimonials
  getAllTestimonials(): Observable<Testimonial[]> {
    return this.getData().pipe(
      map(data => data.testimonials)
    );
  }

  // Get testimonial by ID
  getTestimonialById(testimonialId: number): Observable<Testimonial> {
    return this.getData().pipe(
      map(data => {
        const testimonial = data.testimonials.find((t: Testimonial) => t.id === testimonialId);
        if (!testimonial) {
          throw new Error(`Testimonial with ID ${testimonialId} not found`);
        }
        return testimonial;
      }),
      catchError(error => {
        console.error('Error getting testimonial by ID', error);
        return throwError(error);
      })
    );
  }

  // Get random testimonials
  getRandomTestimonials(count: number = 2): Observable<Testimonial[]> {
    return this.getData().pipe(
      map(data => {
        const testimonials = [...data.testimonials];
        const result: Testimonial[] = [];
        
        // Ensure we don't request more testimonials than exist
        const requestCount = Math.min(count, testimonials.length);
        
        // Simple random selection
        for (let i = 0; i < requestCount; i++) {
          const randomIndex = Math.floor(Math.random() * testimonials.length);
          result.push(testimonials[randomIndex]);
          // Remove selected testimonial to avoid duplicates
          testimonials.splice(randomIndex, 1);
        }
        
        return result;
      })
    );
  }
  
  // Get featured testimonial (for display on homepage)
  getFeaturedTestimonial(): Observable<Testimonial> {
    return this.getData().pipe(
      map(data => {
        // Could implement more sophisticated logic here to pick a truly featured one
        // For now, just return the first one
        return data.testimonials[0];
      })
    );
  }
}