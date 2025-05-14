import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isDropdownOpen = false;
  @ViewChild('productsDropdown') productsDropdown: ElementRef;
  constructor() { }

  ngOnInit(): void {
  }
  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.productsDropdown.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }
}
