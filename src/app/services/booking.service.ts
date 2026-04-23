import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Booking, TimeSlot } from '../models/booking.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);

  private readonly BACKEND_URL = environment.backendUrl;

  constructor() {}

  /**
   * Obtiene los horarios ocupados de la base de datos
   */
  async getAvailableSlots(date: string, duration: number): Promise<TimeSlot[]> {
    try {
      const resp = await fetch(`${this.BACKEND_URL}/appointments?date=${date}`);
      const busySlots: string[] = await resp.json();

      const now = new Date();
      
      // Usamos date-fns si está disponible o una comparación manual robusta
      const today = new Date();
      today.setHours(0,0,0,0);
      const selected = new Date(date + 'T00:00:00');
      
      const isToday = selected.getTime() === today.getTime();
      const currentHourNow = now.getHours();
      const currentMinuteNow = now.getMinutes();

      // Generar slots desde 09:00 hasta 20:00
      const slots: TimeSlot[] = [];
      let currentHour = 9;

      while (currentHour < 20) {
        const timeStr = `${currentHour.toString().padStart(2, '0')}:00`;
        
        let isPast = false;
        if (isToday) {
          // Bloqueamos si la hora ya pasó por completo
          if (currentHour < currentHourNow) {
            isPast = true;
          } else if (currentHour === currentHourNow && currentMinuteNow >= 0) {
            // Si es la hora actual, bloqueamos siempre (una cita no puede empezar "ahora mismo" si ya pasaron minutos)
            isPast = true;
          }
        }

        const isTaken = busySlots.includes(timeStr);
        
        slots.push({
          time: timeStr,
          displayTime: this.formatTime(currentHour, 0),
          isAvailable: !isTaken && !isPast
        });

        currentHour += 1;
      }
      return slots;
    } catch (error) {
      console.error('Error cargando disponibilidad:', error);
      return [];
    }
  }

  addBooking(booking: Omit<Booking, 'id' | 'status' | 'weekNumber' | 'year'>) {
    // Ya no guardamos en local, solo enviamos al backend
    return this.notifyBackend(booking);
  }

  private notifyBackend(booking: any) {
    return this.http.post(`${this.BACKEND_URL}/bookings`, booking);
  }

  // --- ADMIN METHODS ---

  getAllAppointments() {
    return this.http.get<any[]>(`${this.BACKEND_URL}/admin/appointments`);
  }

  deleteAppointment(id: string) {
    return this.http.delete(`${this.BACKEND_URL}/admin/appointments/${id}`);
  }

  updateAppointment(id: string, updates: any) {
    return this.http.put(`${this.BACKEND_URL}/admin/appointments/${id}`, updates);
  }

  private formatTime(h: number, m: number): string {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
  }
}
