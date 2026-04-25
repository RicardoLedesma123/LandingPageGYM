import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="pricing" class="pricing-section">
      <div class="container">
        <div class="section-header">
          <span class="subtitle">Inversión en ti</span>
          <h2 class="section-title">Planes de <span>Transformación</span></h2>
          <p class="description">Elige el nivel de acompañamiento que necesitas para alcanzar tu mejor versión.</p>
        </div>

        <div class="pricing-grid">
          <!-- Plan 1 -->
          <div class="price-card">
            <div class="card-header">
              <h3>Entrenamiento</h3>
              <div class="price"><span>$</span>800<small>/mes</small></div>
            </div>
            <ul class="features">
              <li>✓ Rutina 100% personalizada</li>
              <li>✓ App de seguimiento</li>
              <li>✓ Ajustes mensuales</li>
              <li>✓ Soporte vía WhatsApp</li>
              <li class="disabled">✕ Plan nutricional</li>
              <li class="disabled">✕ Llamada semanal</li>
            </ul>
            <a href="#agenda" class="btn btn-outline">Elegir Plan</a>
          </div>

          <!-- Plan 2 (Featured) -->
          <div class="price-card featured">
            <div class="popular-badge">MÁS ELEGIDO</div>
            <div class="card-header">
              <h3>Transformación</h3>
              <div class="price"><span>$</span>1,500<small>/mes</small></div>
            </div>
            <ul class="features">
              <li>✓ Todo lo de Entrenamiento</li>
              <li>✓ Plan Nutricional flexible</li>
              <li>✓ Lista de compras semanal</li>
              <li>✓ Recetario fit</li>
              <li>✓ Chat prioritario 24/7</li>
              <li>✓ Revisión de técnica por video</li>
            </ul>
            <a href="#agenda" class="btn btn-primary">Empezar Ahora</a>
          </div>

          <!-- Plan 3 -->
          <div class="price-card">
            <div class="card-header">
              <h3>Nutrición Pro</h3>
              <div class="price"><span>$</span>600<small>/mes</small></div>
            </div>
            <ul class="features">
              <li>✓ Plan de alimentación a medida</li>
              <li>✓ Guía de suplementación</li>
              <li>✓ Recetario exclusivo</li>
              <li>✓ Resolución de dudas</li>
              <li class="disabled">✕ Rutina de ejercicios</li>
              <li class="disabled">✕ Seguimiento físico</li>
            </ul>
            <a href="#agenda" class="btn btn-outline">Elegir Plan</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .pricing-section {
      padding: 100px 0;
      background: #050505;
    }

    .section-header {
      text-align: center;
      margin-bottom: 60px;
      .subtitle { color: #E4007C; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-size: 13px; }
      .section-title { font-size: 42px; margin: 10px 0; span { color: #E4007C; } }
      .description { color: #888; max-width: 600px; margin: 0 auto; }
    }

    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      max-width: 1100px;
      margin: 0 auto;
    }

    .price-card {
      background: #0a0a0a;
      border: 1px solid #1a1a1a;
      border-radius: 24px;
      padding: 40px;
      transition: all 0.4s ease;
      display: flex;
      flex-direction: column;
      position: relative;

      &:hover {
        transform: translateY(-10px);
        border-color: rgba(228, 0, 124, 0.3);
        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
      }

      &.featured {
        background: #0d0d0d;
        border: 2px solid #E4007C;
        box-shadow: 0 15px 35px rgba(228, 0, 124, 0.15);
        
        .popular-badge {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          background: #E4007C;
          color: #fff;
          padding: 6px 20px;
          border-radius: 50px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .btn-primary {
          box-shadow: 0 10px 20px rgba(228, 0, 124, 0.3);
        }
      }

      .card-header {
        text-align: center;
        margin-bottom: 30px;
        h3 { font-size: 24px; margin-bottom: 15px; }
        .price {
          font-size: 48px;
          font-weight: 900;
          color: #fff;
          span { font-size: 24px; vertical-align: top; margin-right: 5px; color: #E4007C; }
          small { font-size: 16px; color: #666; font-weight: 400; }
        }
      }

      .features {
        list-style: none;
        padding: 0;
        margin: 0 0 40px 0;
        flex-grow: 1;
        li {
          padding: 12px 0;
          color: #bbb;
          font-size: 15px;
          border-bottom: 1px solid #151515;
          &.disabled { color: #444; text-decoration: line-through; border-color: transparent; }
        }
      }

      .btn {
        width: 100%;
        text-align: center;
        padding: 16px;
        border-radius: 12px;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 14px;
        transition: 0.3s;
      }

      .btn-outline {
        border: 1px solid #E4007C;
        color: #E4007C;
        &:hover { background: #E4007C; color: #fff; }
      }

      .btn-primary {
        background: #E4007C;
        color: #fff;
        &:hover { background: #ff1a8c; transform: scale(1.02); }
      }
    }

    @media (max-width: 768px) {
      .pricing-section { padding: 60px 20px; }
      .section-title { font-size: 32px; }
    }
  `]
})
export class PricingComponent {}
