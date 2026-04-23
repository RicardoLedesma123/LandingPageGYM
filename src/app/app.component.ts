import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { BookingComponent } from './components/booking/booking.component';
import { AboutTrainerComponent } from './components/about-trainer/about-trainer.component';
import { WhatsappButtonComponent } from './components/whatsapp-button/whatsapp-button.component';
import { AdminComponent } from './components/admin/admin.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    HeroComponent, 
    BookingComponent, 
    AboutTrainerComponent,
    WhatsappButtonComponent,
    AdminComponent
  ],
  template: `
    <!-- Switch between Admin and Landing -->
    <ng-container *ngIf="!isAdminView(); else adminTmpl">
      <app-navbar></app-navbar>
      <app-hero></app-hero>
      
      <app-about-trainer></app-about-trainer>

    <!-- Services Section -->
    <section id="servicios" class="section-padding services-v">
      <div class="container">
        <div class="text-center mb-60">
          <span class="subtitle">Mis Servicios</span>
          <h2 class="section-title">Programas diseñados para ti</h2>
          <p class="description-text">Cada programa es diferente porque tú eres diferente. Elige el camino que mejor se adapte a tus necesidades.</p>
        </div>
        <div class="services-grid">
          <div class="glass-card s-card">
            <div class="icon">🏋️</div>
            <div class="line"></div>
            <h3>Entrenamiento Personal</h3>
            <p>Sesiones 1 a 1 enfocadas 100% en tus objetivos. Yo te guío en cada repetición.</p>
            <ul>
              <li>✓ Evaluación física completa</li>
              <li>✓ Seguimiento semanal</li>
            </ul>
            <a href="#agenda" class="btn btn-outline btn-sm">Agendar Sesión</a>
          </div>

          <div class="glass-card s-card featured">
            <div class="badge">RECOMENDADO</div>
            <div class="icon">⚡</div>
            <div class="line"></div>
            <h3>Transformación Completa</h3>
            <p>El programa definitivo: Entrenamiento + Nutrición con acompañamiento integral diario.</p>
            <ul>
              <li>✓ Todo lo de entrenamiento</li>
              <li>✓ Plan alimenticio a medida</li>
              <li>✓ Acceso prioritario</li>
            </ul>
            <a href="#agenda" class="btn btn-primary btn-sm">Agendar Ahora</a>
          </div>

          <div class="glass-card s-card">
            <div class="icon">🥗</div>
            <div class="line"></div>
            <h3>Plan de Nutrición</h3>
            <p>Tu alimentación es clave. Diseño planes adaptados a tu vida, tus gustos y tus metas.</p>
            <ul>
              <li>✓ Consulta nutricional</li>
              <li>✓ Lista de compras semanal</li>
            </ul>
            <a href="#agenda" class="btn btn-outline btn-sm">Agendar Consulta</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Transformations (CAROUSEL) -->
    <section id="resultados" class="section-padding results-v">
      <div class="container">
        <div class="text-center mb-60">
          <span class="subtitle">Resultados Reales</span>
          <h2 class="section-title">Testigos de la Transformación</h2>
        </div>
        
        <div class="carousel-container">
          <div class="result-item-active" *ngFor="let res of transformations; let i = index" [hidden]="currentResult() !== i">
            <div class="before-after-box glass-card">
              <div class="images-container">
                <div class="img-side">
                  <span class="label">Antes</span>
                  <img [src]="res.before" alt="Antes">
                </div>
                <div class="divider"></div>
                <div class="img-side">
                  <span class="label">Después</span>
                  <img [src]="res.after" alt="Después">
                </div>
              </div>
              <div class="result-details">
                <h3>{{ res.name }}</h3>
                <p class="accent-text">{{ res.program }}</p>
                <div class="stat-badge">{{ res.achievement }}</div>
                <p class="quote">"{{ res.quote }}"</p>
              </div>
            </div>
          </div>

          <!-- Controls -->
          <div class="carousel-controls">
            <button (click)="prevResult()" class="control-btn">←</button>
            <div class="dots">
              <span *ngFor="let d of transformations; let i = index" 
                    [class.active]="currentResult() === i"
                    (click)="currentResult.set(i)"></span>
            </div>
            <button (click)="nextResult()" class="control-btn">→</button>
          </div>
        </div>
      </div>
    </section>

    <app-booking id="agenda"></app-booking>

    <!-- Location Section -->
    <section class="section-padding location-v">
      <div class="container">
        <div class="location-grid glass-card">
          <div class="location-info">
            <span class="subtitle">Ubicación</span>
            <h2 class="section-title text-left">Visítanos en <span>Plaza Vallarta</span></h2>
            <p class="mt-20">Estamos listos para recibirte en las mejores instalaciones de Aguascalientes.</p>
            
            <div class="contact-list mt-40">
              <div class="contact-item">
                <span class="c-icon">📍</span>
                <div>
                  <p class="c-label">Dirección</p>
                  <p class="c-value">Av. Vallarta 301-D, Vistas de Oriente, 20196 Aguascalientes, Ags.</p>
                </div>
              </div>
              <div class="contact-item">
                <span class="c-icon">📱</span>
                <div>
                  <p class="c-label">Teléfono</p>
                  <p class="c-value">449 204 1451</p>
                </div>
              </div>
              <div class="contact-item">
                <span class="c-icon">⏰</span>
                <div>
                  <p class="c-label">Horarios</p>
                  <p class="c-value">Lun - Vie: 5:00 AM - 12:00 AM</p>
                  <p class="c-value">Sáb: 8:00 AM - 4:00 PM | Dom: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="map-box">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3702.3274945763264!2d-102.23849668453472!3d21.883030885541624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8429f1f3c837ccbd%3A0xd42d06c61b812dc8!2sAv.%20Vallarta%20301-D%2C%20Vistas%20de%20Oriente%2C%2020196%20Aguascalientes%2C%20Ags.!5e0!3m2!1ses-419!2smx!4v1745426785086!5m2!1ses-419!2smx" 
              width="100%" height="100%" style="border:0; border-radius: 12px;" allowfullscreen="" loading="lazy">
            </iframe>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="logo">VOLCANO<span>GYM</span></div>
            <p class="mt-20">Tu entrenadora personal. Transformación real, resultados reales.</p>
          </div>
          <div>
            <h4>Navegación</h4>
            <ul class="footer-links">
              <li><a href="#sobre-mi">Sobre Mí</a></li>
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#resultados">Resultados</a></li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <p>📍 <strong>Plaza Vallarta</strong></p>
            <p>Av. Vallarta 301-D, Vistas de Oriente, 20196 Aguascalientes, Ags.</p>
            <p class="mt-10">📱 449 204 1451</p>
          </div>
          <div>
            <h4>Horarios</h4>
            <p><strong>Lun - Vie:</strong> 5:00 AM - 12:00 AM</p>
            <p><strong>Sábado:</strong> 8:00 AM - 4:00 PM</p>
            <p><strong>Domingo:</strong> 10:00 AM - 2:00 PM</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 Volcano Gym. Desarrollado por SiuBit Software.</p>
        </div>
      </div>
    </footer>

    <app-whatsapp-button></app-whatsapp-button>
    </ng-container>

    <ng-template #adminTmpl>
      <app-admin></app-admin>
    </ng-template>
  `,
  styles: [`
    .mb-60 { margin-bottom: 60px; }
    .text-center { text-align: center; }
    .mt-20 { margin-top: 20px; }

    .description-text {
      color: #9A9A9A;
      max-width: 600px;
      margin: 0 auto;
    }

    .services-v { background-color: #0A0A0A; }
    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }

    .s-card {
      text-align: center;
      .icon { font-size: 40px; margin-bottom: 20px; }
      .line { width: 30px; height: 3px; background: #E4007C; margin: 0 auto 20px; }
      h3 { margin-bottom: 15px; }
      p { font-size: 14px; color: #9A9A9A; margin-bottom: 20px; }
      ul { 
        text-align: left; 
        margin-bottom: 30px; 
        li { font-size: 13px; color: #fff; margin-bottom: 10px; }
      }
      &.featured {
        border-color: #E4007C;
        position: relative;
        box-shadow: 0 0 30px rgba(228, 0, 124, 0.1);
        .badge {
          position: absolute;
          top: -12px;
          right: 20px;
          background: #E4007C;
          color: #fff;
          font-size: 10px;
          font-weight: 900;
          padding: 4px 12px;
          border-radius: 4px;
        }
      }
    }

    .results-v { background-color: #000000; }
    
    .carousel-container {
      max-width: 900px;
      margin: 0 auto;
    }

    .before-after-box {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 40px;
      padding: 0 !important;
      overflow: hidden;
      align-items: center;
    }

    .images-container {
      display: flex;
      height: 450px;
      position: relative;
      background: #111;

      .img-side {
        width: 50%;
        position: relative;
        overflow: hidden;
        .label {
          position: absolute;
          bottom: 15px;
          left: 15px;
          background: #E4007C;
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          padding: 4px 10px;
          text-transform: uppercase;
          z-index: 2;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.8);
        }
      }

      .divider {
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        width: 3px;
        background: #E4007C;
        z-index: 3;
        box-shadow: 0 0 15px #E4007C;
        transform: translateX(-50%);
      }
    }

    .result-details {
      padding: 40px;
      h3 { font-size: 32px; margin-bottom: 5px; }
      .accent-text { color: #E4007C; font-weight: 700; text-transform: uppercase; font-size: 12px; margin-bottom: 15px; }
      .stat-badge {
        display: inline-block;
        border: 1px solid #E4007C;
        color: #E4007C;
        padding: 5px 15px;
        font-size: 18px;
        font-weight: 900;
        font-family: 'Oswald';
        margin-bottom: 25px;
      }
      .quote { font-style: italic; font-size: 15px; color: #9A9A9A; line-height: 1.8; }
    }

    .carousel-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 30px;
      margin-top: 40px;
      
      .control-btn {
        background: none;
        border: 1px solid #E4007C;
        color: #E4007C;
        width: 45px;
        height: 45px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        transition: 0.3s;
        &:hover { background: #E4007C; color: #000; }
      }

      .dots {
        display: flex;
        gap: 10px;
        span {
          width: 8px;
          height: 8px;
          background: #333;
          border-radius: 50%;
          cursor: pointer;
          &.active { background: #E4007C; width: 20px; border-radius: 10px; }
        }
      }
    }

    .footer {
      background: #080808;
      padding: 80px 0 30px;
      margin-top: 50px;
      h4 { color: #E4007C; margin-bottom: 20px; text-transform: uppercase; font-family: 'Oswald'; font-size: 14px; letter-spacing: 1px; }
      p { color: #9A9A9A; font-size: 14px; line-height: 1.6; }
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1.2fr 1.3fr;
      gap: 40px;
      margin-bottom: 50px;
      .logo { font-size: 24px; font-family: 'Oswald'; font-weight: 700; span { color: #E4007C; } }
    }
    .mt-10 { margin-top: 10px; }
    .footer-links {
      li { margin-bottom: 10px; a { color: #9A9A9A; font-size: 14px; &:hover { color: #E4007C; } } }
    }
    .footer-bottom {
      border-top: 1px solid #1c1c1c;
      padding-top: 30px;
      text-align: center;
      color: #555;
      font-size: 12px;
    }

    @media (max-width: 768px) {
      .footer-grid { grid-template-columns: 1fr; gap: 40px; }
      .before-after-box { grid-template-columns: 1fr; }
      .images-container { height: 350px; }
    }

    .location-v { background-color: #050505; }
    .location-grid {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 50px;
      padding: 50px !important;
      align-items: center;
    }
    .text-left { text-align: left; margin: 0; }
    .mt-40 { margin-top: 40px; }
    
    .contact-list {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }
    .contact-item {
      display: flex;
      gap: 20px;
      align-items: flex-start;
      .c-icon { font-size: 24px; }
      .c-label { font-size: 12px; color: #E4007C; font-weight: 700; text-transform: uppercase; margin-bottom: 5px; }
      .c-value { font-size: 15px; color: #fff; line-height: 1.5; }
    }

    .map-box {
      height: 400px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 0 30px rgba(228, 0, 124, 0.1);
    }

    @media (max-width: 992px) {
      .location-grid { grid-template-columns: 1fr; padding: 30px !important; }
      .map-box { height: 300px; }
    }

    .fade-in { animation: fadeIn 0.4s ease; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class AppComponent {
  isAdminView = signal(window.location.hash === '#admin');

  constructor() {
    window.addEventListener('hashchange', () => {
      this.isAdminView.set(window.location.hash === '#admin');
    });
  }

  currentResult = signal(0);

  transformations = [
    {
      name: 'Laura M.',
      program: 'Transformación Completa',
      achievement: '-15 KG EN 12 SEMANAS',
      quote: 'Nunca pensé que podría verme así. Gracias Danna por creer en mí cuando yo no lo hacía.',
      before: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=600',
      after: 'https://images.unsplash.com/photo-1507398941214-57f1cca440cd?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Carlos R.',
      program: 'Entrenamiento Personal',
      achievement: '+8 KG MÚSCULO EN 16 SEMANAS',
      quote: 'Danna cambió mi enfoque totalmente. Los resultados superaron mis expectativas en tiempo récord.',
      before: 'https://images.unsplash.com/photo-1583454110551-21f2fa2ec617?auto=format&fit=crop&q=80&w=600',
      after: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Sofía L.',
      program: 'Plan Nutrición',
      achievement: '-12 KG EN 10 SEMANAS',
      quote: 'Por fin entendí cómo comer para nutrirme y no solo para llenar el estómago. Una experiencia brutal.',
      before: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600',
      after: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=600'
    }
  ];

  nextResult() {
    this.currentResult.update(v => (v + 1) % this.transformations.length);
  }

  prevResult() {
    this.currentResult.update(v => (v - 1 + this.transformations.length) % this.transformations.length);
  }
}
