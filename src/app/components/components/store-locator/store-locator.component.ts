import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { StoreLocation, StoreLocatorService } from '../../services/store-locator.service';

@Component({
  selector: 'app-store-locator',
  templateUrl: './store-locator.component.html',
  styleUrls: ['./store-locator.component.scss']
})
export class StoreLocatorComponent implements OnInit {
  storeLocations: StoreLocation[] = [];
  filteredLocations: StoreLocation[] = [];
  selectedLocation: StoreLocation | null = null;
  services: string[] = [];
  selectedServices: string[] = [];
  loading = true;
  error = '';
  searchKeyword = '';

  constructor(private storeService: StoreLocatorService,private dataService: DataService) { }

  ngOnInit(): void {
    this.loadStoreLocations();
  }

  loadStoreLocations(): void {
    this.dataService.getStoreLocatorPageData().subscribe({
      next: (data) => {
        this.storeLocations = data.storeLocations || [];
        this.filteredLocations = [...this.storeLocations];
        
        const allServices = new Set<string>();
        this.storeLocations.forEach(location => {
          location.services.forEach(service => {
            allServices.add(service);
          });
        });
        
        this.services = Array.from(allServices).sort();
        
        if (this.storeLocations.length > 0) {
          this.selectStore(this.storeLocations[0]);
        }
        
        this.loading = false;
        
        setTimeout(() => {
          this.initializeMap();
        }, 100);
      },
      error: (err) => {
        this.error = 'Không thể tải thông tin cửa hàng. Vui lòng thử lại sau.';
        this.loading = false;
        console.error('Error loading store locations:', err);
      }
    });
  }

  initializeMap(): void {

    console.log('Map initialized with store locations:', this.storeLocations);
    
  }

  selectStore(store: StoreLocation): void {
    this.selectedLocation = store;
    
  }

  toggleService(service: string): void {
    const index = this.selectedServices.indexOf(service);
    if (index > -1) {
      this.selectedServices.splice(index, 1);
    } else {
      this.selectedServices.push(service);
    }
    this.filterStores();
  }

  filterStores(): void {
    if (this.selectedServices.length === 0 && !this.searchKeyword) {
      this.filteredLocations = [...this.storeLocations];
      return;
    }
    
    this.filteredLocations = this.storeLocations.filter(store => {
      const serviceMatch = this.selectedServices.length === 0 || 
                          this.selectedServices.every(service => 
                            store.services.includes(service));
      
      const searchMatch = !this.searchKeyword || 
                        store.name.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
                        store.address.toLowerCase().includes(this.searchKeyword.toLowerCase());
      
      return serviceMatch && searchMatch;
    });
    
    if (this.filteredLocations.length > 0 && (!this.selectedLocation || 
        !this.filteredLocations.some(l => l.id === this.selectedLocation?.id))) {
      this.selectStore(this.filteredLocations[0]);
    } else if (this.filteredLocations.length === 0) {
      this.selectedLocation = null;
    }
  }

  clearFilters(): void {
    this.selectedServices = [];
    this.searchKeyword = '';
    this.filterStores();
  }

  onSearchChange(): void {
    this.filterStores();
  }

  getCurrentDay(): string {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayIndex = new Date().getDay();
    return days[dayIndex];
  }

  isStoreOpen(store: StoreLocation): boolean {
    const currentDay = this.getCurrentDay();
    const hours = store.openingHours[currentDay as keyof typeof store.openingHours];
    
    if (hours === 'Closed') {
      return false;
    }

    return true;
  }
}