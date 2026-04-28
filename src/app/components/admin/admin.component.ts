import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { HttpClientModule } from '@angular/common/http';
import { parseISO, isPast, isToday, format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="admin-layout">
      <!-- Login Screen -->
      <div class="login-container" *ngIf="!isLoggedIn()">
        <div class="glass-card login-card">
          <div class="logo">VOLCANO<span>ADMIN</span></div>
          <p class="login-subtitle">Acceso restringido para administración</p>
          
          <form (ngSubmit)="login()">
            <div class="form-group">
              <label>Usuario</label>
              <input type="text" [(ngModel)]="loginData.user" name="user" placeholder="Ingresa tu usuario">
            </div>
            <div class="form-group">
              <label>Contraseña</label>
              <input type="password" [(ngModel)]="loginData.pass" name="pass" placeholder="••••••••">
            </div>
            
            <p class="error-msg" *ngIf="loginError()">{{ loginError() }}</p>
            
            <button type="submit" class="btn btn-primary full-width mt-20">
              Iniciar Sesión
            </button>
            
            <button type="button" class="btn btn-outline full-width mt-10" (click)="goToPublic()">
              Volver al Sitio Público
            </button>
          </form>
        </div>
      </div>

      <!-- Admin Panel Content -->
      <ng-container *ngIf="isLoggedIn()">
        <!-- Sidebar / Header -->
        <header class="admin-header">
          <div class="logo">VOLCANO<span>ADMIN</span></div>
          <div class="user-info">
            <span>Panel de Gestión</span>
            <div class="header-btns">
              <button class="logout-btn" (click)="isLoggedIn.set(false); logout()">Cerrar Sesión</button>
              <button class="logout-btn outline" (click)="goToPublic()">Ir al Sitio</button>
            </div>
          </div>
        </header>

      <main class="container admin-content">
        <!-- Dashboard Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-info">
              <span class="stat-label">Citas Hoy</span>
              <span class="stat-value">{{ stats().today }}</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <span class="stat-label">Esta Semana</span>
              <span class="stat-value">{{ stats().week }}</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-info">
              <span class="stat-label">Servicio Top</span>
              <span class="stat-value">{{ stats().topService }}</span>
            </div>
          </div>
        </div>

        <div class="header-actions">
          <div class="title-group">
            <h2>Gestión de Citas</h2>
            <div class="action-bar">
              <div class="filter-tabs">
                <button [class.active]="filter() === 'active'" (click)="filter.set('active')">
                  Vigentes
                </button>
                <button [class.active]="filter() === 'past'" (click)="filter.set('past')">
                  Pasadas
                </button>
              </div>
              <div class="search-box">
                <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  [ngModel]="searchTerm()" 
                  (ngModelChange)="searchTerm.set($event)"
                  placeholder="Buscar por nombre...">
              </div>
            </div>
          </div>
          <button class="refresh-btn" (click)="loadAppointments()">
            <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            Actualizar
          </button>
        </div>

        <div class="glass-card table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Servicio</th>
                <th>WhatsApp</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let apt of filteredAppointments()" class="apt-row">
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
                    <a [href]="'https://wa.me/52' + apt.client_phone" target="_blank" class="wa-link">
                      <svg class="icon-xs" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.408 0 12.044c0 2.123.554 4.197 1.608 6.042L0 24l6.135-1.61a11.751 11.751 0 005.911 1.613h.005c6.634 0 12.044-5.41 12.049-12.047 0-3.213-1.252-6.234-3.528-8.511"/>
                      </svg>
                      Contactar
                    </a>
                  </div>
                </td>
                <td>
                  <div class="actions">
                    <button class="edit-btn" (click)="openEdit(apt)">
                      <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                      </svg>
                    </button>
                    <button class="delete-btn" (click)="deleteAppointment(apt.id)">
                      <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="filteredAppointments().length === 0" class="empty-state">
            No hay citas {{ filter() === 'active' ? 'vigentes' : 'pasadas' }} registradas.
          </div>
        </div>
      </main>
    </ng-container>

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
      flex-wrap: wrap;
      gap: 15px;
      
      .logo { font-size: 20px; font-family: 'Oswald'; span { color: #E4007C; } }
      .user-info { 
        display: flex; 
        align-items: center; 
        gap: 20px; 
        font-size: 13px; 
        color: #666; 
      }
      .header-btns {
        display: flex;
        gap: 10px;
      }
    }

    /* Login Styles */
    .login-container {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at center, #1a0b14 0%, #050505 100%);
      padding: 20px;
      z-index: 9999;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 40px;
      text-align: center;
      border: 1px solid rgba(228, 0, 124, 0.2);
      .logo { font-size: 32px; margin-bottom: 10px; }
      .login-subtitle { color: #666; font-size: 14px; margin-bottom: 30px; }
    }

    .error-msg {
      color: #ff4d4d;
      font-size: 12px;
      margin-top: 15px;
      background: rgba(255, 77, 77, 0.1);
      padding: 8px;
      border-radius: 4px;
    }

    .full-width { width: 100%; }
    .mt-10 { margin-top: 10px; }
    .mt-20 { margin-top: 20px; }

    .logout-btn {
      background: #1a1a1a;
      color: #fff;
      border: 1px solid #333;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: 0.3s;
      &:hover { background: #E4007C; border-color: #E4007C; }
      &.outline { background: transparent; &:hover { background: #333; } }
    }

    .admin-content {
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .admin-header {
        padding: 20px;
        flex-direction: column;
        align-items: flex-start;
        
        .user-info {
          width: 100%;
          justify-content: space-between;
          margin-top: 5px;
        }
      }
      .admin-content {
        padding: 20px 10px;
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: #111;
      border: 1px solid #1a1a1a;
      padding: 20px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 15px;
      transition: 0.3s;
      &:hover { border-color: #E4007C; transform: translateY(-3px); }
      .stat-icon { font-size: 24px; background: rgba(228, 0, 124, 0.1); padding: 10px; border-radius: 10px; }
      .stat-info {
        display: flex;
        flex-direction: column;
        .stat-label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
        .stat-value { font-size: 20px; font-weight: 700; font-family: 'Oswald'; color: #fff; }
      }
    }

    .icon-sm { width: 16px; height: 16px; }
    .icon-xs { width: 14px; height: 14px; }

    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      h2 { font-family: 'Oswald'; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    }

    .title-group {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .action-bar {
      display: flex;
      gap: 20px;
      align-items: center;
      flex-wrap: wrap;
    }

    .filter-tabs {
      display: flex;
      background: #111;
      padding: 4px;
      border-radius: 30px;
      border: 1px solid #333;
      button {
        background: transparent;
        border: none;
        color: #666;
        padding: 8px 24px;
        border-radius: 25px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: 0.3s;
        &.active {
          background: #E4007C;
          color: #fff;
          box-shadow: 0 0 15px rgba(228, 0, 124, 0.3);
        }
        &:hover:not(.active) {
          color: #fff;
        }
      }
    }

    .search-box {
      position: relative;
      background: #111;
      border: 1px solid #333;
      border-radius: 30px;
      padding: 8px 15px;
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 250px;
      input {
        background: transparent;
        border: none;
        color: #fff;
        font-size: 13px;
        outline: none;
        width: 100%;
        &::placeholder { color: #555; }
      }
      &:focus-within { border-color: #E4007C; }
    }

    .refresh-btn {
      background: transparent;
      border: 1px solid #E4007C;
      color: #E4007C;
      padding: 8px 20px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: 0.3s;
      &:hover { background: #E4007C; color: #000; }
    }

    .table-container {
      overflow-x: auto;
      border: 1px solid #1a1a1a;
      border-radius: 12px;
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
      .wa-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(37, 211, 102, 0.1);
        color: #25D366;
        text-decoration: none;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 700;
        transition: 0.3s;
        &:hover { background: #25D366; color: #000; transform: translateY(-2px); }
      }
    }

    .actions {
      display: flex;
      gap: 10px;
      button {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        border: 1px solid #1a1a1a;
        background: #000;
        color: #666;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.3s;
        &.edit-btn:hover { border-color: #0096ff; color: #0096ff; background: rgba(0, 150, 255, 0.1); }
        &.delete-btn:hover { border-color: #ff4d4d; color: #ff4d4d; background: rgba(255, 77, 77, 0.1); }
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

  isLoggedIn = signal(localStorage.getItem('volcano_admin_token') === 'true');
  loginData = { user: '', pass: '' };
  loginError = signal('');

  appointments = signal<any[]>([]);
  filter = signal<'active' | 'past'>('active');
  searchTerm = signal('');
  editingApt = signal<any | null>(null);
  isSaving = signal(false);

  filteredAppointments = computed(() => {
    const all = this.appointments();
    const today = format(new Date(), 'yyyy-MM-dd');
    const search = this.searchTerm().toLowerCase();
    
    return all.filter(apt => {
      // Name filter
      const matchesName = apt.client_name.toLowerCase().includes(search);
      if (!matchesName) return false;

      // Status filter
      const isPastDate = apt.appointment_date < today;
      return this.filter() === 'active' ? !isPastDate : isPastDate;
    }).sort((a, b) => {
      const dateA = `${a.appointment_date} ${a.appointment_time}`;
      const dateB = `${b.appointment_date} ${b.appointment_time}`;
      return this.filter() === 'active' 
        ? dateA.localeCompare(dateB) 
        : dateB.localeCompare(dateA);
    });
  });

  stats = computed(() => {
    const all = this.appointments();
    const now = new Date();
    const start = startOfWeek(now, { weekStartsOn: 1 });
    const end = endOfWeek(now, { weekStartsOn: 1 });

    const todayCount = all.filter(apt => isToday(parseISO(apt.appointment_date))).length;
    const weekCount = all.filter(apt => {
      const date = parseISO(apt.appointment_date);
      return isWithinInterval(date, { start, end });
    }).length;

    // Top service
    const counts: any = {};
    all.forEach(apt => {
      counts[apt.service_type] = (counts[apt.service_type] || 0) + 1;
    });
    
    let topService = '-';
    let max = 0;
    Object.keys(counts).forEach(key => {
      if (counts[key] > max) {
        max = counts[key];
        topService = key;
      }
    });

    const serviceMap: any = {
      'training': 'Entrenamiento',
      'nutrition': 'Nutrición',
      'complete': 'Completo'
    };

    return {
      today: todayCount,
      week: weekCount,
      topService: serviceMap[topService] || topService
    };
  });

  hours = Array.from({ length: 11 }, (_, i) => `${(i + 9).toString().padStart(2, '0')}:00`);

  editForm = {
    appointment_date: '',
    appointment_time: '',
    client_name: '',
    service_type: '',
    duration_minutes: 60
  };

  ngOnInit() {
    if (this.isLoggedIn()) {
      this.loadAppointments();
    }
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

  login() {
    if (this.loginData.user === 'admin' && this.loginData.pass === 'admin123') {
      this.isLoggedIn.set(true);
      localStorage.setItem('volcano_admin_token', 'true');
      this.loginError.set('');
      this.loadAppointments();
    } else {
      this.loginError.set('Credenciales incorrectas. Intenta de nuevo.');
    }
  }

  logout() {
    this.isLoggedIn.set(false);
    localStorage.removeItem('volcano_admin_token');
  }

  goToPublic() {
    window.location.hash = '';
    window.location.reload();
  }
}
