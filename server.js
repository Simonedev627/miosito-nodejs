const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

const app = express();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(cors({
  origin: 'https://abatel.org',
  methods: ['GET','POST','DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- File prenotazioni ---
const bookingsFile = path.join(__dirname, 'bookings.json');

// --- Carica prenotazioni ---
let bookings = {};
function loadBookings() {
  try {
    bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8') || '{}');
    console.log("📂 Prenotazioni caricate:", bookings);
  } catch (e) {
    bookings = {};
    console.log("⚠️ bookings.json vuoto o mancante, creo nuovo oggetto");
  }
}
loadBookings();

// --- Salva prenotazioni ---
function saveBookings() {
  fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));
  console.log("💾 Prenotazioni salvate:", bookings);
}

// --- Funzione invio email ---
async function sendEmail(to, subject, text, attachments=[]) {
  const msg = { to, from: "info@abatel.org", subject, text, attachments };
  try { await sgMail.send(msg); console.log("📧 Email inviata"); }
  catch(err){ console.error("❌ Errore invio email:", err); }
}

// --- API PRENOTAZIONI ---
app.get("/api/bookings", (req,res)=>{
  loadBookings();
  res.json(bookings);
});

app.post("/api/bookings", async (req,res)=>{
  const { date, name, time, userId } = req.body;
  if(!date || !name || !time || !userId) return res.json({ success:false, error:"Dati mancanti" });

  if(bookings[date] && bookings[date].userId !== userId)
    return res.json({ success:false, error:"Data già prenotata" });

  bookings[date] = { name, time, userId, ts: Date.now() };
  saveBookings();

  const formattedDate = new Date(date).toLocaleDateString('it-IT',{ weekday:'long', year:'numeric', month:'long', day:'numeric' });

  await sendEmail(
    "info@abatel.org",
    `📅 Nuova prenotazione: ${formattedDate}`,
    `Hai ricevuto una nuova prenotazione!\n\n👤 Nome: ${name}\n📧 UserID: ${userId}\n📅 Data: ${formattedDate}\n⏰ Orario: ${time}`
  );

  res.json({ success:true, bookings });
});

app.delete("/api/bookings/:date", async (req,res)=>{
  const { date } = req.params;
  const { userId } = req.body;

  loadBookings();
  if(!bookings[date]) return res.json({ success:false, error:"Prenotazione non trovata" });
  if(bookings[date].userId !== userId) return res.json({ success:false, error:"Non puoi eliminare questa prenotazione" });

  const { name, time } = bookings[date];
  delete bookings[date];
  saveBookings();

  const formattedDate = new Date(date).toLocaleDateString('it-IT',{ weekday:'long', year:'numeric', month:'long', day:'numeric' });
  await sendEmail(
    "info@abatel.org",
    `❌ Prenotazione eliminata: ${formattedDate}`,
    `La seguente prenotazione è stata eliminata:\n\n👤 Nome: ${name}\n📧 UserID: ${userId}\n📅 Data: ${formattedDate}\n⏰ Orario: ${time}`
  );

  res.json({ success:true, bookings });
});

// --- Pulizia prenotazioni passate ---
function cleanupBookings() {
  loadBookings();
  const today = new Date();
  today.setHours(0,0,0,0);
  for(const date in bookings){
    const bookingDate = new Date(date+'T00:00:00');
    bookingDate.setHours(0,0,0,0);
    if(bookingDate < today){
      console.log(`🗑 Prenotazione eliminata (data passata): ${date}`);
      delete bookings[date];
    }
  }
  saveBookings();
}
setInterval(cleanupBookings, 24*60*60*1000); // 1 volta al giorno

// --- Avvio server ---
const PORT = process.env.PORT || 10000;
app.listen(PORT,()=>console.log(`✅ Server online sulla porta ${PORT}`));
