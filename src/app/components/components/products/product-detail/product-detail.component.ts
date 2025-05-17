import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../services/data.service';
import { Watch } from '../../../services/watches.service';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  watch: Watch | null = null;
  relatedWatches: Watch[] = [];
  category: any;
  loading: boolean = true;
  error: string = '';
  activeImageIndex: number = 0;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private location: Location,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadProductDetails();
  }

  loadProductDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Không tìm thấy sản phẩm';
      this.loading = false;
      return;
    }

    this.dataService.getProductDetailPageData(id).subscribe({
      next: (data) => {
        this.watch = data.product;
        this.category = data.category;
        this.relatedWatches = data.relatedProducts;
        this.loading = false;
        setTimeout(() => {
          this.initializeTabs();
        }, 100);
      },
      error: (err) => {
        this.error = 'Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.';
        this.loading = false;
        console.error('Error loading product details:', err);
      }
    });
  }

  initializeTabs(): void {
    const firstTab = document.querySelector('.nav-tabs .nav-link.active');
    if (firstTab) {
      (firstTab as HTMLElement).click();
    }
  }

  changeImage(index: number): void {
    this.activeImageIndex = index;
  }

  getDiscountedPrice(price: number, discount: number | null): number {
    if (discount) {
      return price * (1 - discount/100);
    }
    return price;
  }

  getSanitizedDescription() {
    if (this.watch && this.watch.description) {
      return this.sanitizer.bypassSecurityTrustHtml(this.watch.description);
    }
    return '';
  }

  goBack(): void {
    this.location.back();
  }
  navigateToProduct(productId: string, event?: Event): void {
    if (event) {
      event.preventDefault(); 
    }
    
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/products', productId]);
    });
  }
}