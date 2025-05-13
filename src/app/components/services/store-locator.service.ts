import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  openingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class StoreLocatorService {
  private dataUrl = 'assets/data/alberto-clocks-data.json';
  private storeData: Observable<any> | null = null;

  constructor(private http: HttpClient) { }

  private getData(): Observable<any> {
    if (!this.storeData) {
      this.storeData = this.http.get<any>(this.dataUrl).pipe(
        catchError(error => {
          console.error('Error fetching store data', error);
          return throwError('Failed to load store location data. Please try again later.');
        }),
        shareReplay(1)
      );
    }
    return this.storeData;
  }

  getAllStoreLocations(): Observable<StoreLocation[]> {
    return this.getData().pipe(
      map(data => data.storeLocations)
    );
  }

  getStoreLocationById(storeId: string): Observable<StoreLocation> {
    return this.getData().pipe(
      map(data => {
        const store = data.storeLocations.find((s: StoreLocation) => s.id === storeId);
        if (!store) {
          throw new Error(`Store location with ID ${storeId} not found`);
        }
        return store;
      }),
      catchError(error => {
        console.error('Error getting store location by ID', error);
        return throwError(error);
      })
    );
  }

  getStoresByService(service: string): Observable<StoreLocation[]> {
    return this.getData().pipe(
      map(data => {
        return data.storeLocations.filter((store: StoreLocation) => 
          store.services.includes(service)
        );
      })
    );
  }

  getNearestStore(userLat: number, userLng: number): Observable<StoreLocation> {
    return this.getData().pipe(
      map(data => {
        const stores = data.storeLocations;
        
        if (stores.length === 0) {
          throw new Error('No store locations available');
        }
        
        let nearestStore = stores[0];
        let minDistance = this.calculateDistance(
          userLat, userLng, 
          stores[0].coordinates.latitude, 
          stores[0].coordinates.longitude
        );
        
        for (let i = 1; i < stores.length; i++) {
          const distance = this.calculateDistance(
            userLat, userLng, 
            stores[i].coordinates.latitude, 
            stores[i].coordinates.longitude
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            nearestStore = stores[i];
          }
        }
        
        return nearestStore;
      }),
      catchError(error => {
        console.error('Error finding nearest store', error);
        return throwError(error);
      })
    );
  }
  
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const latDiff = lat1 - lat2;
    const lngDiff = lng1 - lng2;
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
  }
  
  getUserLocation(): Observable<{latitude: number, longitude: number}> {
    return new Observable(observer => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            observer.complete();
          },
          (error) => {
            console.error('Error getting user location', error);
            observer.error('Could not get your current location. Please enable location services.');
          }
        );
      } else {
        observer.error('Geolocation is not supported by this browser.');
      }
    });
  }
  
  getDirectionsToStore(storeId: string): Observable<string> {
    return this.getStoreLocationById(storeId).pipe(
      map(store => {
        return `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.latitude},${store.coordinates.longitude}`;
      })
    );
  }
}