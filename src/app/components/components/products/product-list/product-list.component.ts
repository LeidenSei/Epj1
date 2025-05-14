import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { Watch } from '../../../services/watches.service';

declare var $: any;

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, AfterViewInit {
  watches: Watch[] = [];
  filteredWatches: Watch[] = [];
  categories: any[] = [];
  selectedCategory: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 9;
  loading: boolean = true;
  error: string = '';
  Math = Math;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || '';
      this.loadProducts();
    });
  }

  ngAfterViewInit(): void {
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

  filterProducts(): void {
    if (this.selectedCategory) {
      this.filteredWatches = this.watches.filter(watch => 
        watch.categoryId === this.selectedCategory
      );
    } else {
      this.filteredWatches = [...this.watches];
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredWatches = this.filteredWatches.slice(startIndex, endIndex);
  }

  initializeIsotope(): void {
    if ($ && $.fn.isotope) {
      const productsGrid = $('.properties-box');
      if (productsGrid.length) {
        productsGrid.isotope({
          itemSelector: '.properties-items',
          layoutMode: 'fitRows'
        });

        $('.properties-filter li a').on('click', function() {
          const filterValue = $(this).attr('data-filter');
          productsGrid.isotope({ filter: filterValue });

          $('.properties-filter li a').removeClass('is_active');
          $(this).addClass('is_active');
          return false;
        });
        if (this.selectedCategory) {
          $(`.properties-filter li a[data-filter=".${this.selectedCategory}"]`).trigger('click');
        }
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
}