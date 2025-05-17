// product-detail-modal.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Watch } from 'src/app/components/services/watches.service';

declare var $: any;

@Component({
  selector: 'app-product-detail-modal',
  templateUrl: './product-detail-modal.component.html',
  styleUrls: ['./product-detail-modal.component.scss']
})
export class ProductDetailModalComponent implements OnInit {
  @Input() watch: Watch | null = null;
  @Input() category: any = null;
  @Input() relatedWatches: Watch[] = [];
  @Input() loading: boolean = false;
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() viewRelatedWatch = new EventEmitter<Watch>();
  
  activeImageIndex: number = 0;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  show(): void {
    $('#productDetailModal').modal('show');
    setTimeout(() => {
      this.initializeModalComponents();
    }, 200);
  }
  
  hide(): void {
    $('#productDetailModal').modal('hide');
    this.closeModal.emit();
  }
  
  changeImage(index: number): void {
    this.activeImageIndex = index;
  }
  
  viewRelated(watch: Watch): void {
    this.viewRelatedWatch.emit(watch);
  }
  
  private initializeModalComponents(): void {
    $('.modal-product-gallery .gallery-item').on('click', function() {
      $('.modal-product-gallery .gallery-item').removeClass('active');
      $(this).addClass('active');
    });
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
}