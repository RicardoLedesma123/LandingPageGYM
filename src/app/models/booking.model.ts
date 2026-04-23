export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  type: 'training' | 'nutrition' | 'complete';
  date: string;          // ISO Date: "2026-04-25"
  time: string;          // "10:00"
  duration: number;      // minutes
  status: 'confirmed' | 'cancelled';
  weekNumber: number;    // Helper for validation
  year: number;          // Helper for validation
}

export interface TimeSlot {
  time: string;
  displayTime: string;
  isAvailable: boolean;
}

export interface BookingType {
  id: string;
  name: string;
  duration: number;
  icon: string;
  description: string;
  price: number;
}
