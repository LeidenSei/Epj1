import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

interface Product {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  price: number;
  discount: number | null;
  description: string;
  images: string[];
  inStock: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string = 'all';
  searchKeyword: string = '';
  loading: boolean = true;
  error: string = '';
  selectedProduct: Product | null = null;
  
  itemsPerPage: number = 6;
  currentPage: number = 1;
  
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadGalleryData();
  }

  loadGalleryData(): void {
    this.dataService.getGalleryData().subscribe({
      next: (data) => {
        this.products = data.products || [];
        this.categories = data.categories || [];
        this.filteredProducts = [...this.products];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading gallery data:', err);
        this.error = 'Could not load gallery. Please try again later.';
        this.loading = false;
      }
    });
  }

  filterByCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    
    if (categoryId === 'all') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product => product.categoryId === categoryId);
    }
    
    this.applySearch();
  }

  applySearch(): void {
    if (this.searchKeyword) {
      const keyword = this.searchKeyword.toLowerCase();
      this.filteredProducts = this.filteredProducts.filter(product => 
        product.name.toLowerCase().includes(keyword) || 
        product.brand.toLowerCase().includes(keyword)
      );
    }
  }

  onSearchChange(): void {
    this.currentPage = 1;
    
    if (this.selectedCategory === 'all') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product => product.categoryId === this.selectedCategory);
    }
    
    this.applySearch();
  }

  openProductDetail(product: Product): void {
    this.selectedProduct = product;
  }

  closeProductDetail(): void {
    this.selectedProduct = null;
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getDiscountedPrice(product: Product): number {
    if (product.discount) {
      return product.price * (1 - product.discount / 100);
    }
    return product.price;
  }
}