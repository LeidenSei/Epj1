import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';

interface StoreLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  services: string[];
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  submitted = false;
  success = false;
  loading = false;
  storeLocations: StoreLocation[] = [];
  companyInfo: any = {};
  
  inquirySubjects = [
    'Product Inquiry',
    'Service Appointment',
    'Price Quote',
    'Repair Status',
    'Watch Appraisal',
    'Store Information',
    'Warranty Claims',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern("^[0-9+\\-\\s]+$")]],
      subject: ['Product Inquiry', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
      storeLocation: ['', Validators.required],
      agreement: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.loadContactData();
  }

  loadContactData(): void {
    this.dataService.getContactPageData().subscribe({
      next: (data) => {
        this.storeLocations = data.storeLocations || [];
        this.companyInfo = data.company || {};
      },
      error: (err) => {
        console.error('Error loading contact data:', err);
      }
    });
  }

  get f() { return this.contactForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.contactForm.invalid) {
      return;
    }

    this.loading = true;

    setTimeout(() => {
      this.success = true;
      this.loading = false;
      this.resetForm();
    }, 1500);
  }

  resetForm() {
    this.submitted = false;
    this.contactForm.reset({
      subject: 'Product Inquiry',
      storeLocation: '',
      agreement: false
    });
  }

  getFieldClass(fieldName: string) {
    const field = this.contactForm.get(fieldName);
    return {
      'is-invalid': field?.invalid && (field?.dirty || field?.touched || this.submitted),
      'is-valid': field?.valid && (field?.dirty || field?.touched)
    };
  }

  getMapUrl(location: StoreLocation): string {
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.1155335517404!2d${location.coordinates.longitude}!3d${location.coordinates.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9b4a79fa85%3A0xd4c01582479b0553!2s${encodeURIComponent(location.name)}!5e0!3m2!1sen!2s!4v1684210063387!5m2!1sen!2s`;
  }
}