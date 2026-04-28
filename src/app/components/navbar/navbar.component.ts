import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav [class.scrolled]="isScrolled()">
      <div class="container nav-flex">
        <div class="logo">VOLCANO<span>GYM</span></div>
        <div class="nav-links" [class.mobile-open]="isMobileOpen()">
          <a href="#sobre-mi" (click)="closeMenu()">Sobre Mí</a>
          <a href="#servicios" (click)="closeMenu()">Servicios</a>
          <a href="#pricing" (click)="closeMenu()">Planes</a>
          <a href="#calculadora" (click)="closeMenu()">Calculadora</a>
          <a href="#resultados" (click)="closeMenu()">Resultados</a>
          <a href="#agenda" class="btn btn-primary btn-sm">Reserva tu Cita</a>
        </div>
        <div class="menu-toggle" (click)="toggleMenu()">
          <span [class.active]="isMobileOpen()"></span>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    nav {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000;
      padding: 20px 0;
      transition: all 0.3s ease;
      background: transparent;

      &.scrolled {
        background: #0B0B0B;
        padding: 10px 0;
        box-shadow: 0 5px 20px rgba(0,0,0,0.5);
        border-bottom: 1px solid rgba(212, 168, 67, 0.2);
      }
    }

    .nav-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-family: 'Oswald', sans-serif;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 2px;
      span { color: #E4007C; }
    }

      .nav-links {
        display: flex;
        gap: 40px;
        align-items: center;

        a {
          font-family: 'Oswald', sans-serif;
          text-transform: uppercase;
          font-size: 14px;
          letter-spacing: 1px;
          font-weight: 500;
          color: #FFFFFF;
          text-decoration: none;
          &:hover { color: #E4007C; }
        }
      }

    .menu-toggle {
      display: none;
      cursor: pointer;
      width: 30px;
      height: 20px;
      position: relative;
      span {
        display: block;
        width: 100%;
        height: 2px;
        background: #fff;
        transition: 0.3s;
        &::before, &::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          background: #fff;
          transition: 0.3s;
        }
        &::before { top: 7px; }
        &::after { bottom: 0; }
        
        &.active {
          background: transparent;
          &::before { transform: rotate(45deg); top: 10px; }
          &::after { transform: rotate(-45deg); bottom: 8px; }
        }
      }
    }

    @media (max-width: 768px) {
      .menu-toggle { display: block; }
      .nav-links {
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        width: 70%;
        background: #141414;
        flex-direction: column;
        justify-content: center;
        transition: 0.4s ease;
        transform: translateX(100%);
        &.mobile-open { transform: translateX(0); }
      }
    }
  `]
})
export class NavbarComponent {
  isScrolled = signal(false);
  isMobileOpen = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 100);
  }

  toggleMenu() {
    this.isMobileOpen.update(v => !v);
  }

  closeMenu() {
    this.isMobileOpen.set(false);
  }
}
