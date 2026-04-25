import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="whatsapp-container">
      <!-- Chat Bubble -->
      <div class="chat-bubble" [class.open]="isChatOpen()">
        <div class="chat-header">
          <div class="trainer-info">
            <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=100" alt="Entrenadora">
            <div>
              <p class="name">Volcano Gym</p>
              <p class="status">🟢 En línea</p>
            </div>
          </div>
          <button class="close-btn" (click)="toggleChat()">✕</button>
        </div>
        <div class="chat-body">
          <div class="message">
            ¡Hola! 👋 Soy tu entrenadora personal en Volcano Gym. ¿En qué te puedo ayudar hoy? 💪
            <span class="time">12:00 PM</span>
          </div>
        </div>
        <div class="chat-footer">
          <input type="text" [(ngModel)]="userMessage" placeholder="Escribe un mensaje..." (keyup.enter)="sendMessage()">
          <button class="send-btn" (click)="sendMessage()">➤</button>
        </div>
      </div>

      <!-- Main Button -->
      <button class="wa-fab" (click)="toggleChat()">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp">
      </button>
    </div>
  `,
  styles: [`
    .whatsapp-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 15px;
    }

    .wa-fab {
      width: 60px;
      height: 60px;
      background: #25D366;
      border-radius: 50%;
      border: none;
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.3s;
      animation: pulse 2s infinite;
      
      img { width: 32px; height: 32px; filter: brightness(0) invert(1); }
      &:hover { transform: scale(1.1); }
    }

    .chat-bubble {
      width: 350px;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      display: none;
      flex-direction: column;
      transform: translateY(20px) scale(0.9);
      opacity: 0;
      transition: 0.3s ease;

      &.open {
        display: flex;
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }

    .chat-header {
      background: #075E54;
      padding: 15px;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .trainer-info {
        display: flex;
        align-items: center;
        gap: 10px;
        img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 1px solid #fff; }
        .name { font-weight: 700; font-size: 14px; }
        .status { font-size: 11px; opacity: 0.8; }
      }
      .close-btn { background: none; border: none; color: #fff; cursor: pointer; font-size: 18px; }
    }

    .chat-body {
      height: 200px;
      background: #E5DDD5;
      padding: 15px;
      display: flex;
      align-items: flex-start;
      
      .message {
        background: #fff;
        padding: 10px 15px;
        border-radius: 0 12px 12px 12px;
        font-size: 13px;
        color: #333;
        position: relative;
        max-width: 85%;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        .time { display: block; text-align: right; font-size: 10px; color: #999; margin-top: 5px; }
      }
    }

    .chat-footer {
      padding: 10px;
      display: flex;
      gap: 10px;
      background: #f0f0f0;

      input {
        flex-grow: 1;
        border-radius: 20px;
        border: 1px solid #ddd;
        padding: 8px 15px;
        outline: none;
        font-size: 13px;
      }
      .send-btn {
        background: #075E54;
        color: #fff;
        border: none;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(37,211,102,0.5); }
      70% { box-shadow: 0 0 0 15px rgba(37,211,102,0); }
      100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
    }

    @media (max-width: 768px) {
      .chat-bubble { width: 90vw; right: 0; }
    }
  `]
})
export class WhatsappButtonComponent {
  isChatOpen = signal(false);
  userMessage = '';

  toggleChat() {
    this.isChatOpen.update(v => !v);
  }

  sendMessage() {
    const defaultMsg = 'Hola, vi tu página de Volcano Gym y quiero agendar una cita contigo.';
    const finalMsg = this.userMessage.trim() || defaultMsg;
    // Keeping the original number for the gym
    const url = `https://wa.me/524492041451?text=${encodeURIComponent(finalMsg)}`;
    window.open(url, '_blank');
    this.isChatOpen.set(false);
    this.userMessage = '';
  }
}
