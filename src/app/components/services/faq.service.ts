import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private dataUrl = 'assets/data/alberto-clocks-data.json';
  private faqData: Observable<any> | null = null;

  constructor(private http: HttpClient) { }

  private getData(): Observable<any> {
    if (!this.faqData) {
      this.faqData = this.http.get<any>(this.dataUrl).pipe(
        catchError(error => {
          console.error('Error fetching FAQ data', error);
          return throwError('Failed to load FAQ data. Please try again later.');
        }),
        shareReplay(1)
      );
    }
    return this.faqData;
  }

  // Get all FAQs
  getAllFaqs(): Observable<FAQ[]> {
    return this.getData().pipe(
      map(data => data.faqs)
    );
  }

  // Get FAQ by ID
  getFaqById(faqId: number): Observable<FAQ> {
    return this.getData().pipe(
      map(data => {
        const faq = data.faqs.find((f: FAQ) => f.id === faqId);
        if (!faq) {
          throw new Error(`FAQ with ID ${faqId} not found`);
        }
        return faq;
      }),
      catchError(error => {
        console.error('Error getting FAQ by ID', error);
        return throwError(error);
      })
    );
  }

  searchFaqs(query: string): Observable<FAQ[]> {
    if (!query.trim()) {
      return this.getAllFaqs();
    }
    
    const searchTerm = query.toLowerCase().trim();
    return this.getData().pipe(
      map(data => {
        return data.faqs.filter((faq: FAQ) => 
          faq.question.toLowerCase().includes(searchTerm) || 
          faq.answer.toLowerCase().includes(searchTerm)
        );
      })
    );
  }
  
  getFaqsByCategory(category: string): Observable<FAQ[]> {
    const categoryKeywords: {[key: string]: string[]} = {
      'repair': ['repair', 'service', 'fix', 'maintenance'],
      'warranty': ['warranty', 'guarantee', 'covered'],
      'watches': ['watch', 'timepiece', 'automatic', 'mechanical', 'quartz', 'smart'],
      'value': ['value', 'price', 'worth', 'appraisal', 'investment'],
      'water': ['water', 'resistance', 'waterproof', 'swimming']
    };
    
    const keywords = categoryKeywords[category.toLowerCase()] || [];
    
    if (keywords.length === 0) {
      return this.getAllFaqs();
    }
    
    return this.getData().pipe(
      map(data => {
        return data.faqs.filter((faq: FAQ) => {
          const questionLower = faq.question.toLowerCase();
          return keywords.some(keyword => questionLower.includes(keyword));
        });
      })
    );
  }
}