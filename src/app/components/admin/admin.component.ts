import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="admin-layout">
      <!-- Sidebar / Header -->
      <header class="admin-header">
        <div class="logo">VOLCANO<span>ADMIN</span></div>
        <div class="user-info">
          <span>Panel de Gestión</span>
          <button class="logout-btn" (click)="logout()">Regresar al Sitio</button>
        </div>
      </header>

      <main class="container admin-content">
        <div class="header-actions">
          <h2>Próximas Citas</h2>
          <button class="refresh-btn" (click)="loadAppointments()">🔄 Actualizar</button>
        </div>

        <div class="glass-card table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Servicio</th>
                <th>Contacto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let apt of appointments()" class="apt-row">
                <td>
                  <div class="td-content">
                    <strong>{{ apt.client_name }}</strong>
                    <span class="subtext">{{ apt.client_email }}</span>
                  </div>
                </td>
                <td>{{ apt.appointment_date }}</td>
                <td>{{ apt.appointment_time }}</td>
                <td>
                  <span class="badge" [ngClass]="apt.service_type">
                    {{ apt.service_type }}
                  </span>
                </td>
                <td>
                  <div class="contact-links">
                    <a [href]="'tel:' + apt.client_phone" class="icon-link">📞</a>
                    <a [href]="'https://wa.me/52' + apt.client_phone" target="_blank" class="icon-link">💬</a>
                  </div>
                </td>
                <td>
                  <div class="actions">
                    <button class="edit-btn" (click)="openEdit(apt)">✎</button>
                    <button class="delete-btn" (click)="deleteAppointment(apt.id)">✕</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="appointments().length === 0" class="empty-state">
            No hay citas registradas.
          </div>
        </div>
      </main>

      <!-- Edit Modal -->
      <div class="modal-overlay" *ngIf="editingApt()">
        <div class="modal-content glass-card">
          <h3>Editar Cita</h3>
          <form (ngSubmit)="saveEdit()">
            <div class="form-grid">
              <div class="form-group">
                <label>Fecha</label>
                <input type="date" [(ngModel)]="editForm.appointment_date" name="date">
              </div>
              <div class="form-group">
                <label>Hora</label>
                <select [(ngModel)]="editForm.appointment_time" name="time">
                  <option *ngFor="let h of hours" [value]="h">{{ h }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>Nombre</label>
                <input type="text" [(ngModel)]="editForm.client_name" name="name">
              </div>
              <div class="form-group">
                <label>Servicio</label>
                <select [(ngModel)]="editForm.service_type" name="type">
                  <option value="training">Entrenamiento</option>
                  <option value="nutrition">Nutrición</option>
                  <option value="complete">Completo</option>
                </select>
              </div>
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" (click)="editingApt.set(null)">Cancelar</button>
              <button type="submit" class="btn btn-primary" [disabled]="isSaving()">
                {{ isSaving() ? 'Guardando...' : 'Confirmar Cambios' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      min-height: 100vh;
      background: #050505;
      color: #fff;
      font-family: 'Inter', sans-serif;
    }

    .admin-header {
      background: #000;
      padding: 20px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #1a1a1a;
      .logo { font-size: 20px; font-family: 'Oswald'; span { color: #E4007C; } }
      .user-info { display: flex; align-items: center; gap: 20px; font-size: 13px; color: #666; }
    }

    .logout-btn {
      background: #1a1a1a;
      color: #fff;
      border: 1px solid #333;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      &:hover { background: #E4007C; border-color: #E4007C; }
    }

    .admin-content {
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      h2 { font-family: 'Oswald'; text-transform: uppercase; letter-spacing: 1px; }
    }

    .refresh-btn {
      background: transparent;
      border: 1px solid #E4007C;
      color: #E4007C;
      padding: 8px 20px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 13px;
      transition: 0.3s;
      &:hover { background: #E4007C; color: #000; }
    }

    .table-container {
      overflow-x: auto;
      border: 1px solid #1a1a1a;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      
      th {
        padding: 15px 20px;
        font-size: 12px;
        text-transform: uppercase;
        color: #E4007C;
        border-bottom: 2px solid #1a1a1a;
      }
      
      td {
        padding: 20px;
        border-bottom: 1px solid #1a1a1a;
        font-size: 14px;
      }
    }

    .td-content {
      display: flex;
      flex-direction: column;
      .subtext { font-size: 11px; color: #666; }
    }

    .badge {
      font-size: 10px;
      padding: 4px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      font-weight: 800;
      &.training { background: rgba(0, 150, 255, 0.1); color: #0096ff; }
      &.nutrition { background: rgba(50, 205, 50, 0.1); color: #32cd32; }
      &.complete { background: rgba(228, 0, 124, 0.1); color: #E4007C; }
    }

    .contact-links {
      display: flex;
      gap: 10px;
      .icon-link { text-decoration: none; font-size: 18px; filter: grayscale(1); &:hover { filter: grayscale(0); transform: scale(1.2); } }
    }

    .actions {
      display: flex;
      gap: 8px;
      button {
        width: 32px;
        height: 32px;
        border-radius: 4px;
        border: 1px solid #333;
        background: #111;
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.3s;
        &.edit-btn:hover { border-color: #E4007C; color: #E4007C; }
        &.delete-btn:hover { border-color: #ff4d4d; color: #ff4d4d; }
      }
    }

    .empty-state { padding: 40px; text-align: center; color: #666; }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 3000;
      backdrop-filter: blur(5px);
    }

    .modal-content {
      width: 500px;
      padding: 30px;
      border: 1px solid #E4007C;
      h3 { margin-bottom: 25px; font-family: 'Oswald'; text-transform: uppercase; }
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
      label { font-size: 11px; color: #E4007C; text-transform: uppercase; }
      input, select {
        background: #111;
        border: 1px solid #333;
        padding: 10px;
        color: #fff;
        border-radius: 4px;
        &:focus { border-color: #E4007C; outline: none; }
      }
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 15px;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 700;
      font-size: 13px;
      border: 1px solid transparent;
      &.btn-outline { background: transparent; border-color: #333; color: #666; &:hover { border-color: #fff; color: #fff; } }
      &.btn-primary { background: #E4007C; color: #fff; &:hover { box-shadow: 0 0 20px rgba(228, 0, 124, 0.4); } }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
  `]
})
export class AdminComponent implements OnInit {
  private bookingService = inject(BookingService);

  appointments = signal<any[]>([]);
  editingApt = signal<any | null>(null);
  isSaving = signal(false);

  hours = Array.from({ length: 11 }, (_, i) => `${(i + 9).toString().padStart(2, '0')}:00`);

  editForm = {
    appointment_date: '',
    appointment_time: '',
    client_name: '',
    service_type: '',
    duration_minutes: 60
  };

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.bookingService.getAllAppointments().subscribe({
      next: (data) => this.appointments.set(data),
      error: (err) => console.error('Error loading appointments', err)
    });
  }

  deleteAppointment(id: string) {
    if (confirm('¿Estás seguro de eliminar esta cita? Se borrará también de Google Calendar.')) {
      this.bookingService.deleteAppointment(id).subscribe(() => {
        this.loadAppointments();
      });
    }
  }

  openEdit(apt: any) {
    this.editingApt.set(apt);
    this.editForm = { 
      appointment_date: apt.appointment_date,
      appointment_time: apt.appointment_time,
      client_name: apt.client_name,
      service_type: apt.service_type,
      duration_minutes: apt.duration_minutes
    };
  }

  saveEdit() {
    const id = this.editingApt()?.id;
    if (!id) return;

    this.isSaving.set(true);
    this.bookingService.updateAppointment(id, this.editForm).subscribe({
      next: () => {
        this.editingApt.set(null);
        this.loadAppointments();
        this.isSaving.set(false);
      },
      error: (err) => {
        this.isSaving.set(false);
        alert(err.error?.error || 'Error al actualizar la cita');
      }
    });
  }

  logout() {
    // Para simplificar, solo recargamos o mandamos a la raíz
    window.location.href = '/';
  }
}
