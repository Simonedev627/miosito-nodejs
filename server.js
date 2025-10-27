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
    from: "esposito.francesco1890@gmail.com", // la tua email verificata su SendGrid
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

  await sendEmail("esposito.francesco1890@gmail.com", `Nuovo messaggio da ${nome}`, messaggio);

  res.send("✅ Messaggio inviato con successo!");
});

// --- API PRENOTAZIONI ---
app.post("/api/bookings", async (req,res)=>{
  const { date, name, time } = req.body;
  if(!date) return res.json({success:false,error:"Data mancante"});

  bookings[date] = { name:name||null, time:time||null, ts:Date.now() };
  saveBookingsToFile();
  console.log(`📅 Nuova prenotazione: ${date} alle ${time} - ${name}`);

  await sendEmail("esposito.francesco1890@gmail.com", `Nuova prenotazione: ${date}`, 
    `Hai ricevuto una nuova prenotazione!\n\nNome: ${name}\nData: ${date}\nOrario: ${time}`
  );

  res.json({success:true, bookings});
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

  await sendEmail("esposito.francesco1890@gmail.com", `💼 Nuova candidatura da ${nome}`,
    `Nuova candidatura ricevuta!\n\n👤 Nome: ${nome}\n📧 Email: ${email}\n💼 Esperienze: ${esperienze}\n⭐ Perché scegliermi: ${motivazione}\n🎯 Ruolo desiderato: ${ruolo}`,
    file
  );

  res.send("✅ Candidatura inviata con successo!");
});

// --- Avvio server ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server online sulla porta ${PORT}`));
