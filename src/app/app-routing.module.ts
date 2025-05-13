import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/components/home/home.component';
import { ProductListComponent } from './components/components/products/product-list/product-list.component';
import { ProductDetailComponent } from './components/components/products/product-detail/product-detail.component';
import { StoreLocatorComponent } from './components/components/store-locator/store-locator.component';
import { AboutComponent } from './components/components/about/about.component';
import { ContactComponent } from './components/components/contact/contact.component';
import { GalleryComponent } from './components/components/gallery/gallery.component';
import { TechnologyComponent } from './components/components/technology/technology.component';
import { SupportComponent } from './components/components/support/support.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'store-locator', component: StoreLocatorComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'technology', component: TechnologyComponent },
  { path: 'support', component: SupportComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }