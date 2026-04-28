import { Component, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-siubit-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="siubit-container">
      <!-- Chat Bubble -->
      <div class="chat-bubble" [class.open]="isChatOpen()" (click)="$event.stopPropagation()">
        <div class="chat-header">
          <div class="brand-info">
            <img src="assets/SIUBIT_PNGNEGATIVO.png" alt="SiuBit Software" class="header-logo">
          </div>
          <button class="close-btn" (click)="toggleChat()">✕</button>
        </div>
        
        <div class="chat-body">
          <div class="welcome-message">
            <div class="avatar">
              <img src="assets/siubit-new-icon.png" alt="SiuBit">
            </div>
            <div class="text-bubble">
              <p><strong>¿Te gusta este diseño?</strong> 👋</p>
              <p>En <strong>SiuBit Software</strong> podemos personalizar cada sección y funcionalidad basándonos en tus gustos y necesidades únicas.</p>
              <p>Lleva tu presencia digital al siguiente nivel con una plataforma profesional hecha a tu medida.</p>
            </div>
          </div>
          
          <div class="chat-footer-action">
            <button class="whatsapp-direct-btn" (click)="contactWhatsApp()">
              <div class="wa-icon-container">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA">
              </div>
              <span>Quiero mi sitio personalizado</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Floating Button (DEMO Text Pill) -->
      <button class="wa-fab" (click)="toggleChat($event)" [class.active]="isChatOpen()">
        <span class="demo-text">DEMO</span>
        <div class="notification-dot"></div>
      </button>
    </div>
  `,
  styles: [`
    :host {
      --siubit-blue: #00AEEF;
      --siubit-green: #76B900;
      --siubit-dark: #000000;
    }

    .siubit-container {
      position: fixed;
      bottom: 30px;
      right: 110px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 15px;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }

    /* Floating Button - Pill Shape */
    .wa-fab {
      height: 56px;
      min-width: 80px;
      padding: 0 20px;
      background: var(--siubit-dark);
      border: 2px solid var(--siubit-blue);
      border-radius: 28px; /* Pill shape */
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(0, 174, 239, 0.3);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: visible;

      .demo-text {
        color: #fff;
        font-weight: 900;
        font-size: 14px;
        letter-spacing: 2px;
        font-family: 'Oswald', sans-serif;
      }

      .notification-dot {
        position: absolute;
        top: -5px;
        right: 0px;
        width: 14px;
        height: 14px;
        background: var(--siubit-green);
        border: 2px solid var(--siubit-dark);
        border-radius: 50%;
        animation: pulse-dot 2s infinite;
      }

      &:hover {
        transform: scale(1.1) translateY(-5px);
        box-shadow: 0 12px 30px rgba(0, 174, 239, 1);
        border-color: var(--siubit-green);
        .demo-text { color: var(--siubit-green); }
      }

      &.active {
        transform: scale(0.8);
        opacity: 0;
        pointer-events: none;
      }
    }

    /* Chat Bubble Window */
    .chat-bubble {
      width: 360px;
      background: #ffffff;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.25);
      display: flex;
      flex-direction: column;
      transform: translateY(30px) scale(0.9);
      opacity: 0;
      visibility: hidden;
      transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
      position: absolute;
      bottom: 0;
      right: -80px;
      transform-origin: bottom center;

      &.open {
        visibility: visible;
        transform: translateY(0) scale(1);
        opacity: 1;
        bottom: 85px;
      }
    }

    .chat-header {
      background: var(--siubit-dark);
      padding: 15px 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid var(--siubit-blue);

      .brand-info {
        flex: 1;
        display: flex;
        justify-content: center;
        overflow: hidden;
      }

      .header-logo {
        height: 130px;
        width: auto;
        filter: brightness(1.1);
        display: block;
        object-fit: contain;
        transform: scale(1.15);
        margin: 0;
      }

      .close-btn {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        color: #fff;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 0.3s;
        &:hover { background: rgba(255,255,255,0.15); transform: rotate(90deg); }
      }
    }

    .chat-body {
      padding: 30px;
      background: #fdfdfd;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .welcome-message {
      display: flex;
      gap: 15px;
      align-items: flex-start;
      .avatar {
        width: 44px;
        height: 44px;
        background: var(--siubit-dark);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1.5px solid var(--siubit-blue);
        flex-shrink: 0;
        box-shadow: 0 4px 10px rgba(0, 174, 239, 0.2);
        img { width: 30px; height: 30px; }
      }
      .text-bubble {
        background: #fff;
        padding: 18px 20px;
        border-radius: 0 20px 20px 20px;
        box-shadow: 0 8px 15px rgba(0,0,0,0.03);
        border: 1px solid #f0f0f0;
        p { margin: 0; font-size: 14.5px; color: #222; line-height: 1.6; &:not(:last-child) { margin-bottom: 12px; } strong { color: var(--siubit-dark); } }
      }
    }

    .whatsapp-direct-btn {
      width: 100%;
      background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
      color: white;
      border: none;
      padding: 16px;
      border-radius: 16px;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      transition: all 0.4s;
      box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3);
      .wa-icon-container { width: 26px; height: 26px; img { width: 100%; height: 100%; filter: brightness(0) invert(1); } }
      &:hover { transform: translateY(-3px) scale(1.02); }
    }

    @keyframes pulse-dot {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(118, 185, 0, 0.7); }
      70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(118, 185, 0, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(118, 185, 0, 0); }
    }

    @media (max-width: 600px) {
      .siubit-container { 
        right: 140px; 
        bottom: 25px; 
      }
      .chat-bubble { 
        width: calc(100vw - 30px); 
        max-width: 360px;
        right: -120px; 
        bottom: 0;
      }
      .chat-header {
        padding: 20px 15px;
        .header-logo { height: 60px; }
      }
    }

    @media (max-width: 400px) {
      .siubit-container { right: 80px; }
      .chat-bubble { right: -60px; }
    }
  `]
})
export class SiubitPreviewComponent {
  isChatOpen = signal(false);

  constructor(private eRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.isChatOpen() && !this.eRef.nativeElement.contains(event.target)) {
      this.isChatOpen.set(false);
    }
  }

  toggleChat(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isChatOpen.update(v => !v);
  }

  contactWhatsApp() {
    const phoneNumber = '4492610335';
    const message = 'Hola SiuBit Software, me interesa cotizar un sitio web personalizado como la demo de Volcano Gym.';
    const url = `https://wa.me/52${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
}
