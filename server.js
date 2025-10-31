// server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const sgMail = require("@sendgrid/mail");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");

const app = express();

// --- Configura SendGrid ---
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// --- Permetti richieste dal frontend ---
app.use(cors({
  origin: "https://abatel.org", // oppure '*' per test
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// --- Middleware ---
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Connessione a MongoDB Atlas ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connesso a MongoDB Atlas"))
  .catch((err) => console.error("❌ Errore connessione MongoDB:", err));

// --- Modello Prenotazione ---
const bookingSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  time: { type: String, required: true },
  userId: { type: String, required: true },
  ts: { type: Date, default: Date.now },
});
const Booking = mongoose.model("Booking", bookingSchema);

// --- Funzione invio email ---
async function sendEmail(to, subject, text, attachments = []) {
  const msg = { to, from: "info@abatel.org", subject, text, attachments };
  try {
    await sgMail.send(msg);
    console.log("📧 Email inviata!");
  } catch (err) {
    console.error("❌ Errore invio email:", err);
  }
}

// --- Routes base ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "contatti.html"));
});

app.post("/send", async (req, res) => {
  const { nome, email, messaggio } = req.body;
  const testoEmail = `Hai ricevuto un nuovo messaggio dal sito Abatel.org:\n\nNome: ${nome}\nEmail: ${email}\nMessaggio: ${messaggio}`;
  await sendEmail("info@abatel.org", `📩 Nuovo messaggio da ${nome}`, testoEmail);
  res.send("✅ Messaggio inviato con successo!");
});

// --- API PRENOTAZIONI ---

// ✅ Ottieni tutte le prenotazioni (fixato)
app.get("/api/bookings", async (req, res) => {
  try {
    const allBookings = await Booking.find({});
    const bookingsMap = {};
    allBookings.forEach(b => {
      bookingsMap[b.date] = {
        name: b.name,
        time: b.time,
        userId: b.userId,
      };
    });
    res.json({ bookings: bookingsMap });
  } catch (err) {
    console.error("Errore nel recupero prenotazioni:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Crea o aggiorna una prenotazione
// === SALVATAGGIO PRENOTAZIONE ===
app.post("/api/bookings", async (req, res) => {
  try {
    const { name, date, time, userId } = req.body;

    // ✅ Normalizza la data nel formato YYYY-MM-DD (senza orario)
    const d = new Date(date);
    const formattedDate = `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;

    // ✅ Controlla se esiste già una prenotazione per quella data
    const existing = await Booking.findOne({ date: formattedDate });
    if (existing)
      return res.json({ success: false, error: "Data già prenotata" });

    // ✅ Crea la prenotazione con data formattata
    const newBooking = new Booking({
      name,
      date: formattedDate,
      time,
      userId,
    });
    await newBooking.save();

    // (Opzionale) Email di conferma
    await sendEmail(
      "info@abatel.org",
      `📅 Nuova prenotazione: ${formattedDate}`,
      `Nome: ${name}\nData: ${formattedDate}\nOrario: ${time}\nUserID: ${userId}`
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Errore creazione prenotazione:", err);
    res.status(500).json({ success: false, error: "Errore del server" });
  }
});

// === PULIZIA AUTOMATICA PRENOTAZIONI SCADUTE ===
// === PULIZIA AUTOMATICA PRENOTAZIONI SCADUTE ===
async function cleanupBookings() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // reset ore, minuti, secondi

  // data di oggi in formato YYYY-MM-DD
  const isoToday = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  try {
    // elimina prenotazioni con data minore o uguale a oggi
    const result = await Booking.deleteMany({
      date: { $lte: isoToday },
    });
    if (result.deletedCount)
      console.log(`🗑️ Eliminate ${result.deletedCount} prenotazioni scadute`);
  } catch (err) {
    console.error("Errore pulizia prenotazioni:", err);
  }
}

// Esegui la pulizia subito all'avvio
cleanupBookings();

// Poi ogni 24 ore
setInterval(cleanupBookings, 24 * 60 * 60 * 1000);


// ✅ Elimina prenotazione
app.delete("/api/bookings/:date", async (req, res) => {
  const dateParam = decodeURIComponent(req.params.date); // decodifica correttamente la data
  const { userId } = req.body;

  try {
    const booking = await Booking.findOne({ date: dateParam });
    if (!booking) return res.json({ success: false, error: "Prenotazione non trovata" });
    if (booking.userId !== userId)
      return res.json({ success: false, error: "Non hai i permessi per eliminare questa prenotazione" });

    await Booking.deleteOne({ date: dateParam });

    const formattedDate = new Date(dateParam).toLocaleDateString("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // invio mail di notifica
    await sendEmail(
      "info@abatel.org",
      `❌ Prenotazione eliminata: ${formattedDate}`,
      `La prenotazione è stata eliminata:\n\n👤 Nome: ${booking.name}\n📅 Data: ${formattedDate}\n🕒 Orario: ${booking.time}\n🆔 UserID: ${userId}`
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Errore eliminazione prenotazione:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Pulizia prenotazioni passate ---


// --- LAVORA CON NOI ---
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = "./uploads";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      cb(null, dir);
    },
    filename: (req, file, cb) =>
      cb(null, Date.now() + "-" + file.originalname),
  }),
});

app.get("/lavora-con-noi", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "lavora-con-noi.html"))
);

app.post("/lavora", upload.single("cv"), async (req, res) => {
  const { nome, email, esperienze, motivazione, ruolo } = req.body;
  const file = req.file
    ? [
        {
          content: fs.readFileSync(req.file.path).toString("base64"),
          filename: req.file.originalname,
          type: req.file.mimetype,
          disposition: "attachment",
        },
      ]
    : [];
  await sendEmail(
    "info@abatel.org",
    `💼 Nuova candidatura da ${nome}`,
    `Nuova candidatura ricevuta!\nNome: ${nome}\nEmail: ${email}\nEsperienze: ${esperienze}\nMotivazione: ${motivazione}\nRuolo: ${ruolo}`,
    file
  );
  res.send("✅ Candidatura inviata con successo!");
});

// --- Avvio server ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server online sulla porta ${PORT}`));
