import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { BookingType, TimeSlot } from '../../models/booking.model';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isPast,
  addDays,
  isAfter,
  parseISO
} from 'date-fns';
import { es } from 'date-fns/locale';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <section id="booking" class="section-padding booking-section">
      <div class="container">
        <div class="text-center mb-50">
          <p class="subtitle">Agenda tu Cita</p>
          <h2 class="section-title">Comienza tu Transformación</h2>
        </div>

        <div class="booking-stepper glass-card">
          <!-- Stepper Header -->
          <div class="stepper-header">
            <div class="step" [class.active]="step() >= 1" [class.completed]="step() > 1">
              <span class="number">1</span>
              <span class="label">Servicio</span>
            </div>
            <div class="line" [class.active]="step() > 1"></div>
            <div class="step" [class.active]="step() >= 2" [class.completed]="step() > 2">
              <span class="number">2</span>
              <span class="label">Fecha y Hora</span>
            </div>
            <div class="line" [class.active]="step() > 2"></div>
            <div class="step" [class.active]="step() >= 3">
              <span class="number">3</span>
              <span class="label">Tus Datos</span>
            </div>
          </div>

          <!-- Step 1: Type Selection -->
          <div *ngIf="step() === 1" class="step-content fade-in">
            <div class="types-grid">
              <div *ngFor="let type of bookingTypes" 
                   class="type-card" 
                   [class.selected]="selectedType()?.id === type.id"
                   (click)="selectType(type)">
                <div class="icon">{{ type.icon }}</div>
                <h3>{{ type.name }}</h3>
                <p>{{ type.description }}</p>
                <div class="footer">
                  <div class="stats">
                    <span>⏱ {{ type.duration }} min</span>
                    <span class="price">$ {{ type.price }}</span>
                  </div>
                  <span class="check" *ngIf="selectedType()?.id === type.id">✓</span>
                </div>
              </div>
            </div>
            <div class="step-actions">
              <button class="btn btn-primary" [disabled]="!selectedType()" (click)="nextStep()">Siguiente</button>
            </div>
          </div>

          <!-- Step 2: Date & Time -->
          <div *ngIf="step() === 2" class="step-content fade-in">
            <div class="calendar-layout">
              <!-- Custom Calendar UI -->
              <div class="modern-calendar">
                <div class="calendar-header">
                  <h3>{{ currentMonthName() }}</h3>
                  <div class="month-nav">
                    <button (click)="prevMonth()" [disabled]="isCurrentMonthSelected()">←</button>
                    <button (click)="nextMonth()">→</button>
                  </div>
                </div>
                
                <div class="weekdays">
                  <span *ngFor="let day of weekDays">{{ day }}</span>
                </div>
                
                <div class="days-grid">
                  <button *ngFor="let day of calendarDays()"
                          class="day-btn"
                          [class.other-month]="!day.isCurrentMonth"
                          [class.today]="day.isToday"
                          [class.selected]="day.isSelected"
                          [disabled]="day.isDisabled"
                          (click)="selectDate(day.date)">
                    {{ day.date.getDate() }}
                  </button>
                </div>
              </div>

              <!-- Time Picker -->
              <div class="time-picker">
                <h3>Horarios disponibles</h3>
                <p class="selected-date-label" *ngIf="formattedSelectedDate()">
                   {{ formattedSelectedDate() }}
                </p>
                
                <div class="slots-grid" *ngIf="availableSlots().length > 0; else noSlots">
                  <button *ngFor="let slot of availableSlots()" 
                          class="slot-btn" 
                          [disabled]="!slot.isAvailable"
                          [class.selected]="selectedTime() === slot.time"
                          (click)="selectedTime.set(slot.time)">
                    {{ slot.displayTime }}
                  </button>
                </div>
                <ng-template #noSlots>
                  <div class="empty-state">
                    <p>{{ selectedDate() ? 'No hay horarios disponibles para este día.' : 'Selecciona un día para ver horarios.' }}</p>
                  </div>
                </ng-template>
              </div>
            </div>
            <div class="step-actions mt-30">
              <button class="btn btn-outline" (click)="prevStep()">Anterior</button>
              <button class="btn btn-primary" [disabled]="!selectedTime()" (click)="nextStep()">Siguiente</button>
            </div>
          </div>

          <!-- Step 3: Form -->
          <div *ngIf="step() === 3" class="step-content fade-in">
            <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
              <div class="form-grid">
                <div class="form-group">
                  <label>Nombre Completo *</label>
                  <input type="text" formControlName="name" placeholder="Tu nombre">
                </div>
                <div class="form-group">
                  <label>Correo Electrónico *</label>
                  <input type="email" formControlName="email" placeholder="ejemplo@correo.com">
                </div>
                <div class="form-group">
                  <label>Teléfono *</label>
                  <input type="tel" formControlName="phone" placeholder="Tu número">
                </div>
              </div>
              
              <div class="error-msg" *ngIf="errorMessage()">
                {{ errorMessage() }}
              </div>

              <div class="step-actions">
                <button type="button" class="btn btn-outline" (click)="prevStep()">Anterior</button>
                <button type="submit" class="btn btn-primary" [disabled]="bookingForm.invalid">Confirmar Cita</button>
              </div>
            </form>
          </div>

          <!-- Step 4: Success -->
          <div *ngIf="step() === 4" class="step-content success-step fade-in">
            <div class="success-icon">✓</div>
            <h2>¡Cita Confirmada!</h2>
            <p>Te hemos enviado un correo con los detalles.</p>
            <div class="summary">
              <p><strong>Servicio:</strong> {{ selectedType()?.name }}</p>
              <p><strong>Fecha:</strong> {{ formattedSelectedDate() }}</p>
              <p><strong>Hora:</strong> {{ selectedTime() }}</p>
            </div>
            <button class="btn btn-primary" (click)="reset()">Hacer otra reserva</button>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [`
    .booking-section { background-color: #0B0B0B; overflow: hidden; }
    .mb-50 { margin-bottom: 50px; }
    .mt-30 { margin-top: 30px; }
    .text-center { text-align: center; }
    .subtitle { color: #E4007C; font-family: 'Oswald'; letter-spacing: 2px; text-transform: uppercase; }

    .stepper-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 50px;
      .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        .number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2px solid #2A2A2A;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          transition: 0.3s;
        }
        .label { font-size: 12px; text-transform: uppercase; color: #A0A0A0; font-family: 'Oswald'; }
        
        &.active .number { border-color: #E4007C; color: #E4007C; }
        &.completed .number { background: #E4007C; color: #000; border-color: #E4007C; }
      }
      .line {
        height: 2px;
        background: #2A2A2A;
        flex-grow: 1;
        margin: 0 20px;
        &.active { background: #E4007C; }
      }
    }

    .types-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .type-card {
      background: #141414;
      padding: 30px;
      border: 1px solid #2A2A2A;
      cursor: pointer;
      transition: 0.3s;
      position: relative;
      &:hover { border-color: #E4007C; }
      &.selected { background: rgba(228, 0, 124, 0.1); border-color: #E4007C; }
      
      .icon { font-size: 40px; margin-bottom: 20px; }
      h3 { margin-bottom: 10px; }
      p { font-size: 14px; color: #A0A0A0; margin-bottom: 20px; }
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        
        .stats {
          display: flex;
          flex-direction: column;
          gap: 5px;
          font-size: 12px;
          color: #A0A0A0;
          font-weight: 700;
          
          .price {
            font-size: 18px;
            color: #E4007C;
            font-family: 'Oswald';
          }
        }
      }
    }

    /* Modern Calendar Styles */
    .calendar-layout {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 40px;
      margin-bottom: 10px;
    }

    .modern-calendar {
      background: #000;
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #2A2A2A;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      h3 { font-family: 'Oswald'; text-transform: uppercase; color: #fff; margin: 0; }
      .month-nav {
        display: flex;
        gap: 10px;
        button {
          background: #141414;
          border: 1px solid #2A2A2A;
          color: #fff;
          width: 32px;
          height: 32px;
          border-radius: 4px;
          cursor: pointer;
          &:disabled { opacity: 0.2; }
          &:hover:not(:disabled) { border-color: #E4007C; }
        }
      }
    }

    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      margin-bottom: 10px;
      span { font-size: 11px; color: #E4007C; font-weight: 800; text-transform: uppercase; }
    }

    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
    }

    .day-btn {
      background: transparent;
      border: none;
      color: #fff;
      width: 100%;
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 14px;
      border-radius: 50%;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover:not(:disabled) { background: rgba(228, 0, 124, 0.1); color: #E4007C; }
      &.selected { 
        background: #E4007C !important; 
        color: #000 !important; 
        font-weight: 800;
        box-shadow: 0 0 15px rgba(228, 0, 124, 0.5);
        transform: scale(1.1);
      }
      &.today { color: #E4007C; border: 1px solid rgba(228, 0, 124, 0.3); }
      &.other-month { opacity: 0.2; }
      &:disabled { opacity: 0.05; cursor: not-allowed; }
    }

    .selected-date-label {
      background: rgba(228, 0, 124, 0.1);
      color: #E4007C;
      padding: 10px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 20px;
    }

    .slots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;
      max-height: 300px;
      overflow-y: auto;
      padding-right: 5px;
    }

    .slot-btn {
      background: #141414;
      border: 1px solid #2A2A2A;
      color: #fff;
      padding: 12px;
      cursor: pointer;
      border-radius: 4px;
      font-size: 13px;
      &:hover:not(:disabled) { border-color: #E4007C; color: #E4007C; }
      &.selected { background: #E4007C; color: #000; font-weight: 700; border-color: #E4007C; }
      &:disabled { opacity: 0.2; cursor: not-allowed; }
    }

    .empty-state {
      padding: 40px 20px;
      text-align: center;
      background: #080808;
      border: 1px dashed #2A2A2A;
      border-radius: 8px;
      p { color: #555; font-size: 14px; }
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 30px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
      label { font-size: 12px; color: #E4007C; text-transform: uppercase; font-family: 'Oswald'; }
      input {
        background: #141414;
        border: 1px solid #2A2A2A;
        padding: 15px;
        color: #fff;
        border-radius: 4px;
        &:focus { border-color: #E4007C; outline: none; }
      }
    }

    .step-actions {
      display: flex;
      justify-content: flex-end;
      gap: 20px;
      padding-top: 30px;
      border-top: 1px solid #2A2A2A;
    }

    .success-step {
      text-align: center;
      .success-icon {
        width: 80px;
        height: 80px;
        background: #E4007C;
        color: #000;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        margin: 0 auto 30px;
      }
      .summary {
        background: #141414;
        padding: 20px;
        margin: 30px 0;
        text-align: left;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
      }
    }

    .error-msg { color: #E53935; margin-bottom: 20px; font-size: 14px; }

    @media (max-width: 992px) {
      .calendar-layout { grid-template-columns: 1fr; }
    }

    @media (max-width: 768px) {
      .stepper-header { 
        margin-bottom: 30px; 
        .step .label { font-size: 10px; }
        .line { margin: 0 10px; }
      }
      .form-grid { grid-template-columns: 1fr; }
      .step-actions {
        gap: 10px;
        .btn {
          flex: 1;
          padding: 14px 10px;
          font-size: 13px;
        }
      }
    }

    .fade-in { animation: fadeIn 0.5s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class BookingComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bookingService = inject(BookingService);

  step = signal(1);
  selectedType = signal<BookingType | null>(null);
  selectedDate = signal('');
  selectedTime = signal<string | null>(null);
  availableSlots = signal<TimeSlot[]>([]);
  errorMessage = signal('');

  // Calendar State
  currentMonth = signal(new Date());
  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  bookingForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
  });

  bookingTypes: BookingType[] = [
    { id: 'training', name: 'Entrenamiento Personal', duration: 60, icon: '🏋️', description: 'Evaluación y sesión 1 a 1 para maximizar tus resultados.', price: 800 },
    { id: 'nutrition', name: 'Plan Nutricional Pro', duration: 45, icon: '🥗', description: 'Plan de alimentación personalizado basado en ciencia.', price: 600 },
    { id: 'complete', name: 'Transformación Total', duration: 90, icon: '⚡', description: 'Entrenamiento + Nutrición en una sesión integrada.', price: 1500 }
  ];

  ngOnInit() {
  }

  // Calendar Logic
  currentMonthName = computed(() => {
    return format(this.currentMonth(), 'MMMM yyyy', { locale: es });
  });

  isCurrentMonthSelected = computed(() => {
    return isSameMonth(this.currentMonth(), new Date());
  });

  calendarDays = computed(() => {
    const start = startOfWeek(startOfMonth(this.currentMonth()));
    const end = endOfWeek(endOfMonth(this.currentMonth()));
    const days = eachDayOfInterval({ start, end });
    const maxBookingDate = addDays(new Date(), 30); 

    return days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return {
        date,
        isCurrentMonth: isSameMonth(date, this.currentMonth()),
        isToday: isSameDay(date, new Date()),
        isSelected: this.selectedDate() === dateStr,
        isDisabled: (isPast(date) && !isSameDay(date, new Date())) || isAfter(date, maxBookingDate)
      };
    });
  });

  formattedSelectedDate = computed(() => {
    if (!this.selectedDate()) return '';
    return format(parseISO(this.selectedDate()), "EEEE d 'de' MMMM", { locale: es });
  });

  nextMonth() {
    this.currentMonth.update(m => addMonths(m, 1));
  }

  prevMonth() {
    if (!this.isCurrentMonthSelected()) {
      this.currentMonth.update(m => subMonths(m, 1));
    }
  }

  selectDate(date: Date) {
    this.selectedDate.set(format(date, 'yyyy-MM-dd'));
    this.onDateChange();
  }

  selectType(type: BookingType) {
    this.selectedType.set(type);
  }

  nextStep() {
    if (this.step() === 1 && this.selectedType()) {
      this.step.set(2);
      this.scrollToBooking();
    } else if (this.step() === 2 && this.selectedTime()) {
      this.step.set(3);
      this.scrollToBooking();
    }
  }

  prevStep() {
    if (this.step() > 1) {
      this.step.update(s => s - 1);
      this.scrollToBooking();
    }
  }

  private scrollToBooking() {
    setTimeout(() => {
      const element = document.getElementById('booking');
      if (element) {
        const offset = 80; // Margin for navbar
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  }

  async onDateChange() {
    const currentSelectedDate = this.selectedDate();
    const currentType = this.selectedType();
    
    if (currentSelectedDate && currentType) {
      const slots = await this.bookingService.getAvailableSlots(currentSelectedDate, currentType.duration);
      this.availableSlots.set(slots);
      this.selectedTime.set(null);
    }
  }

  onSubmit() {
    if (!this.selectedDate() || !this.selectedTime()) {
      this.errorMessage.set('⚠️ Por favor selecciona fecha y hora antes de confirmar.');
      return;
    }

    const payload = {
      clientName: this.bookingForm.value.name!,
      clientEmail: this.bookingForm.value.email!,
      clientPhone: this.bookingForm.value.phone!,
      type: this.selectedType()!.id as any,
      date: this.selectedDate(),
      time: this.selectedTime()!,
      duration: this.selectedType()!.duration
    };

    this.bookingService.addBooking(payload).subscribe({
      next: (res: any) => {
        this.step.set(4);
      },
      error: (err) => {
        const msg = err.error?.error || 'Error al procesar la cita. Inténtalo de nuevo.';
        this.errorMessage.set(`⚠️ ${msg}`);
      }
    });
  }

  reset() {
    this.step.set(1);
    this.selectedType.set(null);
    this.selectedDate.set('');
    this.selectedTime.set(null);
    this.bookingForm.reset();
    this.errorMessage.set('');
    this.currentMonth.set(new Date());
  }
}
