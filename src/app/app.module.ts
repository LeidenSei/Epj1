import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/components/header/header.component';
import { FooterComponent } from './components/components/footer/footer.component';
import { HomeComponent } from './components/components/home/home.component';
import { ProductListComponent } from './components/components/products/product-list/product-list.component';
import { ProductDetailComponent } from './components/components/products/product-detail/product-detail.component';
import { StoreLocatorComponent } from './components/components/store-locator/store-locator.component';
import { AboutComponent } from './components/components/about/about.component';
import { ContactComponent } from './components/components/contact/contact.component';
import { GalleryComponent } from './components/components/gallery/gallery.component';
import { TechnologyComponent } from './components/components/technology/technology.component';
import { SupportComponent } from './components/components/support/support.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafePipe } from './shared/pipes/safe.pipe';
import { ProductDetailModalComponent } from './shared/product-detail-modal/product-detail-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ProductListComponent,
    ProductDetailComponent,
    StoreLocatorComponent,
    AboutComponent,
    ContactComponent,
    GalleryComponent,
    TechnologyComponent,
    SupportComponent,
    SafePipe,
    ProductDetailModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
