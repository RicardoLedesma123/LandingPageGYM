import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fitness-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="calculator" class="calculator-section">
      <div class="container">
        <div class="calculator-grid">
          <div class="calculator-info">
            <span class="subtitle">Personalización</span>
            <h2 class="section-title">Calculadora de <span>Objetivos</span></h2>
            <p>Descubre qué necesita tu cuerpo para llegar a la meta. Ingresa tus datos y obtén una recomendación instantánea de plan.</p>
            
            <div class="benefits-list">
              <div class="benefit">
                <span class="icon">🎯</span>
                <p>Metas realistas basadas en tu metabolismo.</p>
              </div>
              <div class="benefit">
                <span class="icon">🥗</span>
                <p>Recomendación de macros personalizada.</p>
              </div>
            </div>
          </div>

          <div class="calculator-card glass-card">
            <div *ngIf="!result(); else resultTmpl">
              <div class="form-grid">
                <div class="input-group">
                  <label>Género</label>
                  <select [(ngModel)]="data.gender">
                    <option value="male">Hombre</option>
                    <option value="female">Mujer</option>
                  </select>
                </div>
                <div class="input-group">
                  <label>Edad</label>
                  <input type="number" [(ngModel)]="data.age" placeholder="Ej. 25">
                </div>
                <div class="input-group">
                  <label>Peso (kg)</label>
                  <input type="number" [(ngModel)]="data.weight" placeholder="Ej. 70">
                </div>
                <div class="input-group">
                  <label>Altura (cm)</label>
                  <input type="number" [(ngModel)]="data.height" placeholder="Ej. 170">
                </div>
                <div class="input-group full">
                  <label>Nivel de Actividad</label>
                  <select [(ngModel)]="data.activity">
                    <option value="1.2">Sedentario (Poco o nada de ejercicio)</option>
                    <option value="1.375">Ligero (1-3 días/semana)</option>
                    <option value="1.55">Moderado (3-5 días/semana)</option>
                    <option value="1.725">Intenso (6-7 días/semana)</option>
                  </select>
                </div>
                <div class="input-group full">
                  <label>Tu Objetivo</label>
                  <select [(ngModel)]="data.goal">
                    <option value="lose">Perder Peso / Definición</option>
                    <option value="maintain">Mantener Peso</option>
                    <option value="gain">Ganar Músculo / Volumen</option>
                  </select>
                </div>
              </div>
              <button (click)="calculate()" class="btn btn-primary full-width mt-20">Calcular Mi Plan</button>
            </div>

            <ng-template #resultTmpl>
              <div class="result-view fade-in">
                <h3>Tu Resultado Estimado</h3>
                <div class="calories-box">
                  <span class="label">Calorías Diarias Sugeridas</span>
                  <span class="val">{{ result()?.calories }} <small>kcal</small></span>
                </div>
                
                <div class="recommendation-box">
                  <p class="rec-label">Plan Recomendado:</p>
                  <h4 class="rec-name">{{ result()?.planName }}</h4>
                  <p class="rec-desc">{{ result()?.description }}</p>
                </div>

                <div class="actions">
                  <button (click)="reset()" class="btn btn-outline btn-sm">Reiniciar</button>
                  <a href="#agenda" class="btn btn-primary btn-sm">Agendar Cita con este Plan</a>
                </div>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`

    .subtitle { color: #E4007C; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-size: 13px; }
    .section-title { 
      font-size: clamp(24px, 7vw, 42px); 
      margin: 15px 0; 
      line-height: 1.2;
      max-width: 100%;
      overflow-wrap: break-word;
      word-wrap: break-word;
      hyphens: auto;
      span { color: #E4007C; display: inline-block; max-width: 100%; } 
    }
    
    .benefits-list {
      margin-top: 40px;
      .benefit {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
        .icon { font-size: 24px; }
        p { color: #888; margin: 0; }
      }
    }

    .calculator-card {
      padding: 40px !important;
      border: 1px solid rgba(228, 0, 124, 0.2);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      &.full { grid-column: span 2; }
      
      label { font-size: 13px; color: #aaa; font-weight: 600; }
      input, select {
        background: #111;
        border: 1px solid #222;
        color: #fff;
        padding: 12px;
        border-radius: 8px;
        outline: none;
        &:focus { border-color: #E4007C; }
      }
    }

    .mt-20 { margin-top: 20px; }
    .full-width { width: 100%; }

    .result-view {
      text-align: center;
      h3 { margin-bottom: 30px; font-size: 24px; }
    }

    .calories-box {
      background: rgba(228, 0, 124, 0.1);
      border: 1px dashed #E4007C;
      padding: 20px;
      border-radius: 16px;
      margin-bottom: 30px;
      .label { display: block; font-size: 14px; color: #aaa; margin-bottom: 5px; }
      .val { font-size: 42px; font-weight: 900; color: #E4007C; }
    }

    .recommendation-box {
      margin-bottom: 30px;
      .rec-label { font-size: 12px; text-transform: uppercase; color: #666; margin-bottom: 10px; }
      .rec-name { font-size: 24px; color: #fff; margin-bottom: 10px; }
      .rec-desc { font-size: 14px; color: #888; }
    }

    .actions {
      display: flex;
      gap: 15px;
      justify-content: center;
    }

    .fade-in { animation: fadeIn 0.5s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .calculator-section {
      padding: 80px 0;
      background: #000;
      width: 100%;
      overflow: hidden;
    }

    .calculator-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
      width: 100%;
    }

    @media (max-width: 850px) {
      .calculator-grid { grid-template-columns: 1fr !important; gap: 20px; }
      .calculator-info { text-align: center; padding: 0 10px; }
      .section-title { font-size: 24px !important; text-align: center; }
      .calculator-card { padding: 20px 10px !important; margin: 0; width: 100%; }
      .form-grid { grid-template-columns: 1fr !important; gap: 15px; }
      .input-group.full { grid-column: span 1; }
      .actions { flex-direction: column; gap: 10px; }
      .btn { width: 100%; }
      .benefits-list { display: none; }
    }
  `]
})
export class FitnessCalculatorComponent {
  data = {
    gender: 'female',
    age: null,
    weight: null,
    height: null,
    activity: '1.2',
    goal: 'lose'
  };

  result = signal<any>(null);

  calculate() {
    if (!this.data.weight || !this.data.height || !this.data.age) return;

    // Mifflin-St Jeor Equation
    let bmr;
    if (this.data.gender === 'male') {
      bmr = 10 * this.data.weight + 6.25 * this.data.height - 5 * this.data.age + 5;
    } else {
      bmr = 10 * this.data.weight + 6.25 * this.data.height - 5 * this.data.age - 161;
    }

    const tdee = bmr * parseFloat(this.data.activity);
    let targetCalories;
    let planName = '';
    let description = '';

    if (this.data.goal === 'lose') {
      targetCalories = tdee - 500;
      planName = 'Plan Transformación Integral';
      description = 'Necesitas un déficit controlado con entrenamiento de fuerza para mantener músculo mientras pierdes grasa.';
    } else if (this.data.goal === 'gain') {
      targetCalories = tdee + 300;
      planName = 'Plan Entrenamiento Personalizado';
      description = 'Enfócate en superávit calórico y cargas progresivas para maximizar la hipertrofia.';
    } else {
      targetCalories = tdee;
      planName = 'Plan Nutrición Pro';
      description = 'Mantén tu composición actual mejorando la calidad de tus macros y energía diaria.';
    }

    this.result.set({
      calories: Math.round(targetCalories),
      planName,
      description
    });
  }

  reset() {
    this.result.set(null);
  }
}
