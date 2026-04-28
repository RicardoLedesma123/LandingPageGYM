import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-trainer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="sobre-mi" class="section-padding about-trainer">
      <div class="container grid-container">
        <div class="image-area">
          <div class="image-wrapper">
            <img src="assets/trainer-presentation.png" alt="Sobre Mí">
            <div class="accent-frame-top"></div>
            <div class="accent-frame-bottom"></div>
          </div>
        </div>
        <div class="content-area">
          <div class="accent-line"></div>
          <span class="subtitle">Conoce a tu Entrenadora</span>
          <h2 class="section-title">Más que una entrenadora, <br>tu aliada en cada paso</h2>
          <div class="text-blocks">
            <p>
              Hola, soy <strong>Danna Volcano</strong>, fundadora de Volcano Gym y entrenadora personal certificada. 
              Mi pasión es ayudar a personas como tú a transformar su cuerpo y su relación con el ejercicio.
            </p>
            <p>
              Con más de 8 años de experiencia, he acompañado a cientos de personas en su proceso. 
              Mi enfoque combina entrenamiento personalizado con planes de nutrición adaptados a tu vida.
            </p>
            <p>
              Cuando trabajas conmigo, no eres un número más. Estoy aquí para guiarte, motivarte y 
              demostrarte de lo que eres capaz.
            </p>
          </div>
          <div class="mini-stats">
            <div class="stat-item">
              <h3>+300</h3>
              <p>TRANSFORMACIONES</p>
            </div>
            <div class="stat-item">
              <h3>+8</h3>
              <p>AÑOS EXPERIENCIA</p>
            </div>
            <div class="stat-item">
              <h3>100%</h3>
              <p>COMPROMISO</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-trainer { background-color: #0C0C0C; }
    
    .grid-container {
      display: grid;
      grid-template-columns: 4fr 5fr;
      gap: 40px;
      align-items: center;
      width: 100%;
    }

    .image-wrapper {
      position: relative;
      padding: 20px;
      img { 
        width: 100%; 
        border-radius: 4px; 
        display: block;
      }
      
      .accent-frame-top {
        position: absolute;
        top: 0;
        right: 0;
        width: 100px;
        height: 100px;
        border-top: 3px solid #E4007C;
        border-right: 3px solid #E4007C;
      }
      
      .accent-frame-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100px;
        height: 100px;
        border-bottom: 3px solid #E4007C;
        border-left: 3px solid #E4007C;
      }
    }

    .accent-line {
      width: 40px;
      height: 3px;
      background: #E4007C;
      margin-bottom: 15px;
    }

    .text-blocks {
      margin-bottom: 40px;
      p { color: #9A9A9A; margin-bottom: 20px; line-height: 1.8; }
    }

    .mini-stats {
      display: flex;
      gap: 30px;
      padding-top: 30px;
      border-top: 1px solid #2A2A2A;

      .stat-item {
        h3 { font-size: 32px; color: #fff; margin-bottom: 5px; }
        p { font-size: 11px; color: #E4007C; letter-spacing: 2px; }
      }
    }

    @media (max-width: 768px) {
      .grid-container { grid-template-columns: 1fr; }
      .mini-stats { 
        flex-wrap: wrap; 
        justify-content: center; 
        text-align: center;
        gap: 20px;
      }
    }
  `]
})
export class AboutTrainerComponent {}
