import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  companyInfo: any = null;
  teamMembers: any[] = [];
  statistics: any = null;
  loading = true;
  error = '';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadAboutData();
  }

  loadAboutData(): void {
    this.dataService.getAllData().subscribe({
      next: (data) => {
        this.companyInfo = data.company;
        this.teamMembers = data.testimonials || [];
        this.statistics = data.statistics;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải thông tin. Vui lòng thử lại sau.';
        this.loading = false;
        console.error('Error loading about data:', err);
      }
    });
  }
}