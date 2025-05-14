import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { FAQ } from '../../services/faq.service';
import { WatchService } from '../../services/service.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  faqs: FAQ[] = [];
  services: WatchService[] = [];
  companyInfo: any;
  contactForm: FormGroup;
  loading = true;
  error = '';
  formSubmitted = false;
  formSuccess = false;
  activeServiceTab = 0;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) { 
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern("^[0-9+\\s]*$")],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadSupportData();
  }

  loadSupportData(): void {
    this.dataService.getSupportPageData().subscribe({
      next: (data) => {
        this.faqs = data.faqs;
        this.services = data.services;
        this.dataService.getAllData().subscribe({
          next: (allData) => {
            this.companyInfo = allData.company;
            this.loading = false;
            setTimeout(() => {
              this.initializeAccordions();
            }, 100);
          },
          error: (err) => {
            this.handleDataLoadError(err);
          }
        });
      },
      error: (err) => {
        this.handleDataLoadError(err);
      }
    });
  }

  handleDataLoadError(err: any): void {
    this.error = 'Không thể tải thông tin hỗ trợ. Vui lòng thử lại sau.';
    this.loading = false;
    console.error('Error loading support data:', err);
  }

  initializeAccordions(): void {
    const firstAccordion = document.querySelector('.accordion-button');
    if (firstAccordion) {
      (firstAccordion as HTMLElement).click();
    }
  }

  setActiveService(index: number): void {
    this.activeServiceTab = index;
  }

  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.contactForm.valid) {
      console.log('Form submitted:', this.contactForm.value);
      this.formSuccess = true;
      this.contactForm.reset();
      this.formSubmitted = false;
      setTimeout(() => {
        this.formSuccess = false;
      }, 5000);
    } else {
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }
  get formControls() { 
    return this.contactForm.controls; 
  }
  
  hasError(controlName: string, errorName: string): boolean {
    const control = this.contactForm.get(controlName);
    return !!control && control.hasError(errorName) && (control.dirty || control.touched);
  }
}