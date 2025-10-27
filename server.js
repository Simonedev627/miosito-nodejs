const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const sgMail = require('@sendgrid/mail'); // sendgrid

const app = express();

console.log("✅ Server avviato, cartella public:", path.join(__dirname, "public"));

// --- Set SendGrid API Key ---
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const cors = require('cors');

// Permetti richieste dal tuo frontend
app.use(cors({
  origin: 'https://abatel.org', // o '*' per permettere tutti i domini
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));


// --- Percorso file prenotazioni ---
const bookingsFile = path.join(__dirname, 'bookings.json');

// --- Middleware ---
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // CV

// --- Carica prenotazioni da file ---
let bookings = {};
try {
  bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8') || '{}');
} catch (e) {
  bookings = {};
}

// --- Funzione per salvare prenotazioni ---
function saveBookingsToFile() {
  fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));
}

// --- Funzione invio email SendGrid ---
async function sendEmail(to, subject, text, attachments=[]) {
  const msg = {
    to,
    from: "info@abatel.org", // la tua email verificata su SendGrid
    subject,
    text,
    attachments
  };

  try {
    await sgMail.send(msg);
    console.log("📧 Email inviata!");
  } catch (err) {
    console.error("❌ Errore invio email:", err);
  }
}

// --- EMAIL FORM ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "contatti.html"));
});

app.post("/send", async (req, res) => {
  const { nome, email, messaggio } = req.body;

  const testoEmail = `
Hai ricevuto un nuovo messaggio dal sito Abatel.org:

👤 Nome: ${nome}
📧 Email: ${email}

💬 Messaggio:
${messaggio}
  `;

  await sendEmail(
    "info@abatel.org",
    `📩 Nuovo messaggio da ${nome}`,
    testoEmail
  );

  res.send("✅ Messaggio inviato con successo!");
});


// --- API PRENOTAZIONI ---
// --- API PRENOTAZIONI ---
// Ottieni tutte le prenotazioni
app.get("/api/bookings", (req, res) => {
  res.json(bookings);
});

// Crea o aggiorna prenotazione
app.post("/api/bookings", async (req, res) => {
  const { date, name, time, userId } = req.body;
  if (!date || !name || !time || !userId) {
    return res.json({ success: false, error: "Dati mancanti" });
  }

  // Se la data è già prenotata e non è dello stesso utente → blocca
  if (bookings[date] && bookings[date].userId !== userId) {
    return res.json({ success: false, error: "Questa data è già prenotata da un altro utente" });
  }

  // Salva prenotazione
  bookings[date] = { name, time, userId, ts: Date.now() };
  saveBookingsToFile();
  console.log(`📅 Prenotazione: ${date} alle ${time} - ${name}`);

  // Invia email di notifica
 const formattedDate = new Date(date).toLocaleDateString('it-IT', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

await sendEmail(
  "info@abatel.org",
  `📅 Nuova prenotazione: ${formattedDate}`,
  `Hai ricevuto una nuova prenotazione!\n\n👤 Nome: ${name}\n📧 Email: ${userId}\n📅 Data: ${formattedDate}\n⏰ Orario: ${time}`
);

  res.json({ success: true, bookings });
});

// Elimina prenotazione (solo chi l’ha creata)
app.delete("/api/bookings/:date", (req, res) => {
  const { date } = req.params;
  const { userId } = req.body;

  if (!bookings[date]) {
    return res.json({ success: false, error: "Prenotazione non trovata" });
  }

  if (bookings[date].userId !== userId) {
    return res.json({ success: false, error: "Non hai i permessi per eliminare questa prenotazione" });
  }

  delete bookings[date];
  saveBookingsToFile();
  res.json({ success: true, bookings });
});
// --- Pulizia prenotazioni passate ---
function cleanupBookings() {
  const today = new Date();
  for (const date in bookings) {
    const bDate = new Date(date + 'T00:00:00');
    if (bDate < today) {
      console.log(`🗑 Prenotazione scaduta eliminata: ${date}`);
      delete bookings[date];
    }
  }
  saveBookingsToFile();
}
setInterval(cleanupBookings, 24*60*60*1000);

// --- LAVORA CON NOI ---
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = "./uploads";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    }
  })
});

app.get("/lavora-con-noi", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "lavora-con-noi.html"));
});

app.post("/lavora", upload.single("cv"), async (req, res) => {
  const { nome, email, esperienze, motivazione, ruolo } = req.body;
  const file = req.file ? [{
    content: fs.readFileSync(req.file.path).toString("base64"),
    filename: req.file.originalname,
    type: req.file.mimetype,
    disposition: 'attachment'
  }] : [];

  await sendEmail("info@abatel.org", `💼 Nuova candidatura da ${nome}`,
    `Nuova candidatura ricevuta!\n\n👤 Nome: ${nome}\n📧 Email: ${email}\n💼 Esperienze: ${esperienze}\n⭐ Perché scegliermi: ${motivazione}\n🎯 Ruolo desiderato: ${ruolo}`,
    file
  );

  res.send("✅ Candidatura inviata con successo!");
});

// --- Avvio server ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server online sulla porta ${PORT}`));
