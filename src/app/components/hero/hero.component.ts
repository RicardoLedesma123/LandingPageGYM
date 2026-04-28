import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="hero">
      <div class="overlay"></div>
      <div class="container hero-container">
        <div class="hero-content">
          <div class="accent-line"></div>
          <p class="subtitle">Entrenadora Personal · Nutrición · Resultados</p>
          <h1>Tu Mejor Versión <br>Empieza Hoy.</h1>
          <p class="description">
            Soy tu guía en este proceso. Diseño programas de entrenamiento 
            y nutrición 100% personalizados para que logres los objetivos 
            que siempre quisiste. Sin fórmulas genéricas.
          </p>
          <div class="hero-btns">
            <a href="#agenda" class="btn btn-primary">Agenda tu Cita Gratis</a>
            <a href="#resultados" class="btn btn-outline">Ver Transformaciones</a>
          </div>
        </div>
      </div>
      <div class="hero-bg-image">
        <img src="assets/hero-trainer.png" alt="Entrenadora Personal">
      </div>
      <div class="scroll-indicator">
        <span>SCROLL</span>
        <div class="line"></div>
      </div>
    </header>
  `,
  styles: [`
    .hero {
      height: 100vh;
      width: 100%;
      position: relative;
      display: flex;
      align-items: center;
      background: #0C0C0C;
      overflow: hidden;
    }

    .hero-bg-image {
      position: absolute;
      top: 0;
      right: 0;
      width: 60%;
      height: 100%;
      z-index: 0;
      img { 
        width: 100%; 
        height: 100%; 
        object-fit: cover; 
        object-position: center;
        filter: grayscale(0%) brightness(0.9);
      }
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to right, #0C0C0C 0%, transparent 50%, transparent 100%);
      }
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to top, #0C0C0C 0%, transparent 40%);
      z-index: 1;
    }

    .hero-container {
      position: relative;
      z-index: 2;
    }

    .hero-content {
      max-width: 600px;
      padding-bottom: 50px;
      
      .accent-line {
        width: 60px;
        height: 3px;
        background: #E4007C;
        margin-bottom: 25px;
      }

      h1 {
        font-size: clamp(36px, 10vw, 72px);
        line-height: 1.1;
        margin-bottom: 30px;
        text-shadow: 0 5px 15px rgba(0,0,0,0.5);
        max-width: 100%;
        overflow-wrap: break-word;
      }

      .description {
        font-size: 18px;
        color: #9A9A9A;
        margin-bottom: 45px;
        max-width: 500px;
        line-height: 1.7;
      }
    }

    .hero-btns {
      display: flex;
      gap: 20px;
    }

    .scroll-indicator {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
      z-index: 2;
      
      span {
        font-size: 12px;
        letter-spacing: 3px;
        color: #E4007C;
        font-family: 'Oswald', sans-serif;
      }

      .line {
        width: 1px;
        height: 60px;
        background: linear-gradient(to bottom, #E4007C, transparent);
        animation: scrollLine 2s infinite;
      }
    }

    @keyframes scrollLine {
      0% { height: 0; opacity: 0; }
      50% { height: 60px; opacity: 1; }
      100% { height: 60px; transform: translateY(20px); opacity: 0; }
    }

    @media (max-width: 768px) {
      .hero-bg-image { width: 100%; opacity: 0.5; }
      .hero-content { text-align: center; max-width: 100%; display: flex; flex-direction: column; align-items: center; }
      .hero-btns { 
        flex-direction: column; 
        width: 100%; 
        gap: 15px;
      }
      .btn { width: 100%; padding: 14px 20px; }
      .accent-line { margin: 0 auto 25px !important; }
    }
  `]
})
export class HeroComponent {}
