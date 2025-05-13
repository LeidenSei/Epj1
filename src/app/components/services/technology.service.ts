import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';

export interface Technology {
  id: string;
  name: string;
  description: string;
  image: string;
  details: string[];
  advantages: string[];
  types: {
    name: string;
    description: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {
  private dataUrl = 'assets/data/alberto-clocks-data.json';
  private techData: Observable<any> | null = null;

  constructor(private http: HttpClient) { }

  private getData(): Observable<any> {
    if (!this.techData) {
      this.techData = this.http.get<any>(this.dataUrl).pipe(
        catchError(error => {
          console.error('Error fetching technology data', error);
          return throwError('Failed to load technology data. Please try again later.');
        }),
        shareReplay(1)
      );
    }
    return this.techData;
  }

  // Get all watch technologies
  getAllTechnologies(): Observable<Technology[]> {
    return this.getData().pipe(
      map(data => data.technologies)
    );
  }

  // Get technology by ID
  getTechnologyById(techId: string): Observable<Technology> {
    return this.getData().pipe(
      map(data => {
        const technology = data.technologies.find((t: Technology) => t.id === techId);
        if (!technology) {
          throw new Error(`Technology with ID ${techId} not found`);
        }
        return technology;
      }),
      catchError(error => {
        console.error('Error getting technology by ID', error);
        return throwError(error);
      })
    );
  }

  // Get mechanical movement technology details
  getMechanicalTechnology(): Observable<Technology | null> {
    return this.getData().pipe(
      map(data => {
        return data.technologies.find((t: Technology) => t.id === 'mechanical') || null;
      })
    );
  }

  // Get quartz technology details
  getQuartzTechnology(): Observable<Technology | null> {
    return this.getData().pipe(
      map(data => {
        return data.technologies.find((t: Technology) => t.id === 'quartz') || null;
      })
    );
  }

  // Get smart watch technology details
  getSmartWatchTechnology(): Observable<Technology | null> {
    return this.getData().pipe(
      map(data => {
        return data.technologies.find((t: Technology) => t.id === 'smart') || null;
      })
    );
  }

  // Get spring drive technology details
  getSpringDriveTechnology(): Observable<Technology | null> {
    return this.getData().pipe(
      map(data => {
        return data.technologies.find((t: Technology) => t.id === 'spring-drive') || null;
      })
    );
  }
  
  // Compare two technologies
  compareTechnologies(tech1Id: string, tech2Id: string): Observable<{tech1: Technology, tech2: Technology}> {
    return this.getData().pipe(
      map(data => {
        const tech1 = data.technologies.find((t: Technology) => t.id === tech1Id);
        const tech2 = data.technologies.find((t: Technology) => t.id === tech2Id);
        
        if (!tech1) {
          throw new Error(`Technology with ID ${tech1Id} not found`);
        }
        
        if (!tech2) {
          throw new Error(`Technology with ID ${tech2Id} not found`);
        }
        
        return { tech1, tech2 };
      }),
      catchError(error => {
        console.error('Error comparing technologies', error);
        return throwError(error);
      })
    );
  }
  
  // Get technology types for all technologies
  getAllTechnologyTypes(): Observable<{id: string, name: string, types: {name: string, description: string}[]}[]> {
    return this.getData().pipe(
      map(data => {
        return data.technologies.map((tech: Technology) => {
          return {
            id: tech.id,
            name: tech.name,
            types: tech.types
          };
        });
      })
    );
  }
}