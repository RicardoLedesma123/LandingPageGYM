require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(cors({
  origin: [
    'https://landingpagegym.vercel.app',
    'https://volcano-gym.vercel.app',
    'https://volcanogym.mx',
    'https://hamcoach.com',
    'http://localhost:4200'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// 1. Supabase Setup
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error('❌ ERROR: SUPABASE_URL o SUPABASE_KEY no configuradas en variables de entorno.');
}
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co', 
  process.env.SUPABASE_KEY || 'placeholder'
);

// 2. Google Calendar Setup
let calendar;
try {
  let authOptions = {};
  if (process.env.GOOGLE_CREDENTIALS) {
    try {
      authOptions.credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    } catch (e) {
      console.error('❌ ERROR: GOOGLE_CREDENTIALS no es un JSON válido:', e.message);
    }
  } else {
    const keyPath = path.join(__dirname, 'google-key.json');
    authOptions.keyFile = keyPath;
  }

  if (authOptions.credentials || authOptions.keyFile) {
    const auth = new google.auth.GoogleAuth({
      ...authOptions,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
    calendar = google.calendar({ version: 'v3', auth });
    console.log('✅ Google Calendar API ready');
  }
} catch (error) {
  console.error('❌ Error setting up Google Calendar:', error.message);
}

// 3. Nodemailer Setup (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// GET appointments for a specific day
app.get('/api/appointments', async (req, res) => {
  const { date } = req.query;
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('appointment_time, duration_minutes')
      .eq('appointment_date', date)
      .eq('status', 'confirmed');
    
    if (error) throw error;

    const busySlots = new Set();
    data.forEach(apt => {
      const startParts = apt.appointment_time.split(':');
      const startTotalMin = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
      const endTotalMin = startTotalMin + apt.duration_minutes;

      for (let h = 9; h < 20; h++) {
        const slotStart = h * 60;
        const slotEnd = slotStart + 60;
        if (slotStart < endTotalMin && slotEnd > startTotalMin) {
          busySlots.add(`${h.toString().padStart(2, '0')}:00`);
        }
      }
    });

    res.json(Array.from(busySlots));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST to create a booking
app.post('/api/bookings', async (req, res) => {
  const { clientName, clientEmail, clientPhone, type, date, time, duration } = req.body;

  try {
    // 0. Check weekly limit
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const { data: existing, error: checkError } = await supabase
      .from('appointments')
      .select('id')
      .eq('client_phone', clientPhone)
      .gte('appointment_date', startOfWeek.toISOString().split('T')[0])
      .lte('appointment_date', endOfWeek.toISOString().split('T')[0])
      .eq('status', 'confirmed');

    if (existing && existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Ya tienes una reserva para esta semana. Solo se permite 1 cita por semana.' 
      });
    }

    // 1. Google Calendar Integration
    let googleEventId = null;
    if (calendar) {
      const startDateTime = `${date}T${time}:00`;
      const [h, m] = time.split(':').map(Number);
      let endH = h + Math.floor(duration / 60);
      let endM = m + (duration % 60);
      if (endM >= 60) { endH++; endM -= 60; }
      const endDateTime = `${date}T${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}:00`;

      const event = {
        summary: `Cita: ${clientName} (${type})`,
        description: `Teléfono: ${clientPhone}\nServicio: ${type}`,
        start: { dateTime: startDateTime, timeZone: 'America/Mexico_City' },
        end: { dateTime: endDateTime, timeZone: 'America/Mexico_City' },
      };

      try {
        const googleRes = await calendar.events.insert({
          calendarId: process.env.CALENDAR_ID,
          resource: event,
        });
        googleEventId = googleRes.data.id;
      } catch (gError) {
        console.error('❌ Error de Google Calendar:', gError.message);
      }
    }

    // 2. Save to Supabase
    const { data: dbData, error: dbError } = await supabase
      .from('appointments')
      .insert([
        { 
          client_name: clientName, 
          client_email: clientEmail, 
          client_phone: clientPhone, 
          service_type: type, 
          appointment_date: date, 
          appointment_time: time, 
          duration_minutes: duration,
          google_event_id: googleEventId 
        }
      ]);

    if (dbError) throw dbError;

    // 3. Email Notification
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: clientEmail,
      subject: '¡Cita Confirmada! - Volcano Gym',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background-color: #0b0b0b; color: #ffffff; padding: 40px; border-radius: 15px; text-align: center; border: 1px solid #E4007C;">
          <h2 style="color: #E4007C; margin-bottom: 20px;">¡Cita Confirmada!</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #e0e0e0;">
            Hola <strong>${clientName}</strong>,<br><br>
            Tu cita ha sido agendada con éxito para el día <strong>${date}</strong> a las <strong>${time}</strong>.
          </p>
          <p style="margin-top: 30px;">
            <a href="https://wa.me/524492610335" style="background-color: #E4007C; color: #ffffff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              ¿Dudas? Contáctame aquí
            </a>
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Cita procesada con éxito' });

  } catch (error) {
    console.error('Error processing booking:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// --- ADMIN ENDPOINTS ---

app.get('/api/admin/appointments', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/appointments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data: appointment } = await supabase.from('appointments').select('google_event_id').eq('id', id).single();
    if (appointment?.google_event_id && calendar) {
      try { await calendar.events.delete({ calendarId: process.env.CALENDAR_ID, eventId: appointment.google_event_id }); } catch (e) {}
    }
    const { error } = await supabase.from('appointments').delete().eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/appointments/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const { data: current } = await supabase.from('appointments').select('*').eq('id', id).single();
    // Google Sync logic
    if (current.google_event_id && calendar) {
      try {
        const date = updates.appointment_date || current.appointment_date;
        const time = updates.appointment_time || current.appointment_time;
        const [h, m] = time.split(':').map(Number);
        const duration = updates.duration_minutes || current.duration_minutes;
        let endH = h + Math.floor(duration / 60);
        let endM = m + (duration % 60);
        if (endM >= 60) { endH++; endM -= 60; }
        const endDateTime = `${date}T${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}:00`;

        await calendar.events.patch({
          calendarId: process.env.CALENDAR_ID,
          eventId: current.google_event_id,
          resource: {
            summary: `Cita: ${updates.client_name || current.client_name} (${updates.service_type || current.service_type})`,
            start: { dateTime: `${date}T${time}:00`, timeZone: 'America/Mexico_City' },
            end: { dateTime: endDateTime, timeZone: 'America/Mexico_City' },
          }
        });
      } catch (e) {}
    }
    const { error } = await supabase.from('appointments')
      .update({
        appointment_date: updates.appointment_date,
        appointment_time: updates.appointment_time,
        client_name: updates.client_name,
        client_email: updates.client_email,
        client_phone: updates.client_phone,
        service_type: updates.service_type,
        status: updates.status
      })
      .eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
