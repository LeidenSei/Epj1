import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { Watch } from '../../../services/watches.service';
import { ProductDetailModalComponent } from 'src/app/shared/product-detail-modal/product-detail-modal.component';
import { ProductModalService } from 'src/app/components/services/product-modal.service';

declare var $: any;

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, AfterViewInit {
  @ViewChild(ProductDetailModalComponent) productModal!: ProductDetailModalComponent;
  watches: Watch[] = [];
  filteredWatches: Watch[] = [];
  categories: any[] = [];
  selectedCategory: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 9;
  loading: boolean = true;
  error: string = '';
  Math = Math;
  selectedWatch: Watch | null = null;
  selectedWatchCategory: any = null;
  relatedWatches: Watch[] = [];
  modalLoading: boolean = false;
  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private productModalService: ProductModalService
  ) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || '';
      this.loadProducts();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeIsotope();
    }, 100);
  }

  loadProducts(): void {
    this.loading = true;
    this.dataService.getProductListPageData().subscribe({
      next: (data) => {
        this.watches = data.products;
        this.categories = data.categories;
        this.filterProducts();
        this.loading = false;
        setTimeout(() => {
          this.initializeIsotope();
        }, 100);
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
        console.error('Error loading products:', err);
      }
    });
  }

  filterByCategory(categoryId: string) {
    this.selectedCategory = categoryId;
    this.currentPage = 1; 
    this.filterProducts();
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: categoryId || null },
      queryParamsHandling: 'merge'
    });
  }
  
  filterProducts(): void {
    let filteredList = this.watches;
    
    if (this.selectedCategory) {
      filteredList = this.watches.filter(watch => 
        watch.categoryId === this.selectedCategory
      );
    }
    
    const totalItems = filteredList.length;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    
    if (this.currentPage > totalPages && totalPages > 0) {
      this.currentPage = 1;
    }
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, totalItems);
    this.filteredWatches = filteredList.slice(startIndex, endIndex);

    setTimeout(() => {
      this.initializeIsotope();
    }, 100);
  }

  initializeIsotope(): void {
    if ($ && $.fn.isotope) {
      const productsGrid = $('.properties-box');
      if (productsGrid.length) {
        if (productsGrid.data('isotope')) {
          productsGrid.isotope('destroy');
        }
        
        productsGrid.isotope({
          itemSelector: '.properties-items',
          layoutMode: 'fitRows'
        });
        
        $('.properties-filter li a').removeClass('is_active');
        
        if (this.selectedCategory) {
          $(`.properties-filter li a[data-filter=".${this.selectedCategory}"]`).addClass('is_active');
          productsGrid.isotope({ filter: `.${this.selectedCategory}` });
        } else {
          $('.properties-filter li a[data-filter="*"]').addClass('is_active');
          productsGrid.isotope({ filter: '*' });
        }
        
        $('.properties-filter li a').off('click').on('click', function() {
          const filterValue = $(this).attr('data-filter');
          productsGrid.isotope({ filter: filterValue });
          
          $('.properties-filter li a').removeClass('is_active');
          $(this).addClass('is_active');
          return false;
        });
      }
    } else {
      console.warn('Isotope not available. Make sure to include the library.');
    }
  }
  changePage(page: number): void {
    this.currentPage = page;
    this.filterProducts(); 
    window.scrollTo(0, 0);
  }

  get totalPages(): number {
    return Math.ceil(this.watches.length / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
  }

  navigateToProductDetail(productId: string): void {
    this.router.navigate(['/products', productId]);
  }
  ngOnDestroy(): void {
    const productsGrid = $('.properties-box');
    if (productsGrid.length && productsGrid.data('isotope')) {
      productsGrid.isotope('destroy');
    }
  }
  openWatchDetails(watch: Watch): void {
    this.modalLoading = true;
    this.selectedWatch = watch;
    
    this.productModalService.getProductDetail(watch.id).subscribe({
      next: (data) => {
        this.selectedWatch = data.product;
        this.selectedWatchCategory = data.category;
        this.relatedWatches = data.relatedProducts;
        this.modalLoading = false;

        this.productModal.show();
      },
      error: (err) => {
        this.error = 'Cannot load product details. Please try again later.';
        this.modalLoading = false;
        console.error('Error loading product details:', err);
      }
    });
  }
  
  onCloseModal(): void {
    this.selectedWatch = null;
  }
  
  onViewRelatedWatch(watch: Watch): void {
    this.openWatchDetails(watch);
  }
}