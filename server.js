const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;


// Percorso file prenotazioni
const bookingsFile = path.join(__dirname, 'bookings.json');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // CV

// Carica prenotazioni da file
let bookings = {};
try {
  bookings = JSON.parse(fs.readFileSync(bookingsFile, 'utf8') || '{}');
} catch (e) {
  bookings = {};
}

// Funzione per salvare prenotazioni su file
function saveBookingsToFile() {
  fs.writeFileSync(bookingsFile, JSON.stringify(bookings, null, 2));
}

// --- EMAIL FORM ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "contatti.html"));
});

app.post("/send", async (req, res) => {
  const { nome, email, messaggio } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "esposito.francesco1890@gmail.com",
      pass: "pincgzvcdihuemjo"
    },
  });

  let mailOptions = {
    from: email,
    to: "esposito.francesco1890@gmail.com",
    subject: `Nuovo messaggio da ${nome}`,
    text: messaggio,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("✅ Messaggio inviato con successo!");
  } catch (error) {
    console.error(error);
    res.send("❌ Errore nell'invio del messaggio.");
  }
});

// --- API PRENOTAZIONI ---
app.get("/api/bookings", (req,res)=>{
  res.json(bookings);
});

app.post("/api/bookings", (req,res)=>{
  const { date, name, time } = req.body;
  if(!date) return res.json({success:false,error:"Data mancante"});
  bookings[date] = { name:name||null, time:time||null, ts:Date.now() };
  saveBookingsToFile();
  console.log(`📅 Nuova prenotazione: ${date} alle ${time} - ${name}`);
  res.json({success:true, bookings});
});

app.delete("/api/bookings/:date",(req,res)=>{
  const date = req.params.date;
  if(bookings[date]){
    delete bookings[date];
    saveBookingsToFile();
    console.log(`❌ Prenotazione eliminata: ${date}`);
  }
  res.json({success:true, bookings});
});

// --- Pulisci prenotazioni passate ogni giorno ---
function cleanupBookings() {
  const today = new Date();
  for(const date in bookings){
    const bDate = new Date(date + 'T00:00:00');
    if(bDate < today){
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

// Mostra modulo Lavora con noi
app.get("/lavora-con-noi", (req,res)=>{
  res.sendFile(path.join(__dirname, "views", "lavora-con-noi.html"));
});

// Gestione invio candidatura
app.post("/lavora", upload.single("cv"), async (req,res)=>{
  const { nome, email, esperienze, motivazione, ruolo } = req.body;
  const file = req.file ? path.join(__dirname, req.file.path) : null;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "esposito.francesco1890@gmail.com",
      pass: "pincgzvcdihuemjo"
    }
  });

  let mailOptions = {
    from: email,
    to: "esposito.francesco1890@gmail.com",
    subject: `💼 Nuova candidatura da ${nome}`,
    text: `
Nuova candidatura ricevuta!

👤 Nome: ${nome}
📧 Email: ${email}
💼 Esperienze: ${esperienze}
⭐ Perché scegliermi: ${motivazione}
🎯 Ruolo desiderato: ${ruolo}
`,
    attachments: file ? [{ path: file }] : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("✅ Candidatura inviata con successo!");
    console.log(`📩 Nuova candidatura ricevuta da ${nome} (${email})`);
  } catch (error) {
    console.error(error);
    res.send("❌ Errore durante l'invio della candidatura.");
  }
});

// Avvia server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
