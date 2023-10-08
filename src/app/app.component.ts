import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isNavbarFixed: boolean = false;

  @HostListener('window:scroll', ['$event']) onScroll() {
    if (window.scrollY > 0) {
      setTimeout(() => {
        this.isNavbarFixed = true;
      }, 100);
      
    } else {
      setTimeout(() => {
        this.isNavbarFixed = false;
      }, 100);
    }
  }


}
