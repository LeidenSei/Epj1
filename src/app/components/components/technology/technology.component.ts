import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Technology } from '../../services/technology.service';

@Component({
  selector: 'app-technology',
  templateUrl: './technology.component.html',
  styleUrls: ['./technology.component.scss']
})
export class TechnologyComponent implements OnInit {
  technologies: Technology[] = [];
  loading = true;
  error = '';
  activeTab = 0;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadTechnologies();
  }

  loadTechnologies(): void {
    this.dataService.getTechnologyPageData().subscribe({
      next: (data) => {
        this.technologies = data.technologies;
        this.loading = false;
        setTimeout(() => {
          this.initializeTabs();
        }, 100);
      },
      error: (err) => {
        this.error = 'Không thể tải dữ liệu công nghệ. Vui lòng thử lại sau.';
        this.loading = false;
        console.error('Error loading technologies:', err);
      }
    });
  }

  initializeTabs(): void {
    const firstTab = document.querySelector('.tech-tabs .nav-link.active');
    if (firstTab) {
      (firstTab as HTMLElement).click();
    }
  }

  setActiveTab(index: number): void {
    this.activeTab = index;
  }
}