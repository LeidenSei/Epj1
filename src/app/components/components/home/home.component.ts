import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { WatchesService, Watch, Category } from '../../services/watches.service';
import { CompanyService, Statistics } from '../../services/company.service';
import { Router } from '@angular/router';
import { Testimonial, TestimonialsService } from '../../services/testimonial.service';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredWatches: Watch[] = [];
  categories: Category[] = [];
  statistics: Statistics | null = null;
  testimonials: Testimonial[] = [];
  companyInfo: any = null;
  loading = true;
  error = '';

  constructor(
    private dataService: DataService,
    private watchesService: WatchesService,
    private companyService: CompanyService,
    private testimonialsService: TestimonialsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.dataService.getHomePageData().subscribe(
      data => {
        this.featuredWatches = data.featuredWatches;
        this.categories = data.categories;
        this.statistics = data.statistics;
        this.companyInfo = data.company;
        this.testimonials = data.testimonials;
        this.loading = false;

        setTimeout(() => {
          this.initializeOwlCarousel();
          this.initializeCounters();
        }, 100);
      },
      error => {
        this.error = 'Failed to load homepage data. Please try again later.';
        this.loading = false;
        console.error('Error loading homepage data:', error);
      }
    );
  }

  loadDataWithIndividualServices(): void {
    this.watchesService.getFeaturedWatches(6).subscribe(
      watches => {
        this.featuredWatches = watches;
        this.watchesService.getAllCategories().subscribe(
          categories => {
            this.categories = categories;
            this.companyService.getStatistics().subscribe(
              stats => {
                this.statistics = stats;
                this.testimonialsService.getAllTestimonials().subscribe(
                  testimonials => {
                    this.testimonials = testimonials;
                    this.loading = false;
                    setTimeout(() => {
                      this.initializeOwlCarousel();
                      this.initializeCounters();
                    }, 100);
                  },
                  error => this.handleError(error)
                );
              },
              error => this.handleError(error)
            );
          },
          error => this.handleError(error)
        );
      },
      error => this.handleError(error)
    );
  }

  initializeOwlCarousel(): void {
    $('.owl-banner').owlCarousel({
      items: 1,
      loop: true,
      dots: true,
      nav: true,
      autoplay: true,
      margin: 30,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 1
        },
        1000: {
          items: 1
        }
      },
      navText: [
        '<i class="fas fa-chevron-left"></i>',
        '<i class="fas fa-chevron-right"></i>'
      ]
    });
  }

  initializeCounters(): void {
    $('.timer').each(function() {
      $(this).prop('Counter', 0).animate({
        Counter: $(this).attr('data-to')
      }, {
        duration: 2000,
        easing: 'swing',
        step: function(now) {
          $(this).text(Math.ceil(now).toLocaleString());
        }
      });
    });
  }

  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
  }

  navigateToProductDetail(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  private handleError(error: any): void {
    this.error = 'Error loading data. Please try again later.';
    this.loading = false;
    console.error('API Error:', error);
  }
}