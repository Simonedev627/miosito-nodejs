// server.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const sgMail = require('@sendgrid/mail');
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");

const app = express();

// --- Configura SendGrid ---
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// --- Permetti richieste dal frontend ---
app.use(cors({
  origin: 'https://abatel.org', // o '*' per tutti
  methods: ['GET','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// --- Middleware ---
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"public")));
app.use("/uploads", express.static(path.join(__dirname,"uploads")));

// --- Connessione a MongoDB Atlas ---
mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log("✅ Connesso a MongoDB Atlas"))
  .catch(err=>console.error("❌ Errore connessione MongoDB:", err));

// --- Modello Prenotazione ---
const bookingSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  time: { type: String, required: true },
  userId: { type: String, required: true },
  ts: { type: Date, default: Date.now }
});
const Booking = mongoose.model("Booking", bookingSchema);

// --- Funzione invio email ---
async function sendEmail(to, subject, text, attachments=[]){
  const msg = { to, from:"info@abatel.org", subject, text, attachments };
  try{ await sgMail.send(msg); console.log("📧 Email inviata!"); }
  catch(err){ console.error("❌ Errore invio email:", err); }
}

// --- Routes Frontend ---
app.get("/", (req,res)=>{ res.sendFile(path.join(__dirname,"views","contatti.html")); });

app.post("/send", async (req,res)=>{
  const { nome, email, messaggio } = req.body;
  const testoEmail = `Hai ricevuto un nuovo messaggio dal sito Abatel.org:\n\nNome: ${nome}\nEmail: ${email}\nMessaggio: ${messaggio}`;
  await sendEmail("info@abatel.org", `📩 Nuovo messaggio da ${nome}`, testoEmail);
  res.send("✅ Messaggio inviato con successo!");
});

// --- API PRENOTAZIONI ---
app.get("/api/bookings", async (req,res)=>{
  try{
    const bookings = await Booking.find({});
    res.json(bookings);
  }catch(err){
    res.status(500).json({ success:false, error: err.message });
  }
});

app.post("/api/bookings", async (req,res)=>{
  const { date, name, time, userId } = req.body;
  if(!date||!name||!time||!userId) return res.json({success:false,error:"Dati mancanti"});
  try{
    const existing = await Booking.findOne({date});
    if(existing && existing.userId !== userId) return res.json({success:false,error:"Questa data è già prenotata da un altro utente"});
    
    const booking = await Booking.findOneAndUpdate(
      { date },
      { name, time, userId, ts: new Date() },
      { upsert:true, new:true }
    );

    const formattedDate = new Date(date).toLocaleDateString('it-IT', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    await sendEmail("info@abatel.org", `📅 Nuova prenotazione: ${formattedDate}`, `Hai ricevuto una nuova prenotazione!\nNome: ${name}\nEmail: ${userId}\nData: ${formattedDate}\nOrario: ${time}`);

    res.json({success:true, booking});
  }catch(err){
    res.status(500).json({success:false,error:err.message});
  }
});

app.delete("/api/bookings/:date", async (req,res)=>{
  const { date } = req.params;
  const { userId } = req.body;
  try{
    const booking = await Booking.findOne({ date });
    if(!booking) return res.json({success:false,error:"Prenotazione non trovata"});
    if(booking.userId !== userId) return res.json({success:false,error:"Non hai i permessi per eliminare questa prenotazione"});
    
    await Booking.deleteOne({ date });

    const formattedDate = new Date(date).toLocaleDateString('it-IT', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    await sendEmail("info@abatel.org", `❌ Prenotazione eliminata: ${formattedDate}`, `La seguente prenotazione è stata eliminata:\nNome: ${booking.name}\nData: ${formattedDate}\nOrario: ${booking.time}\nUserID: ${userId}`);

    res.json({success:true});
  }catch(err){ res.status(500).json({success:false,error:err.message}); }
});

// --- Pulizia prenotazioni passate ---
async function cleanupBookings(){
  const today = new Date(); today.setHours(0,0,0,0);
  try{
    const result = await Booking.deleteMany({ date: { $lt: today.toISOString().split('T')[0] } });
    if(result.deletedCount) console.log(`🗑 Eliminate ${result.deletedCount} prenotazioni passate`);
  }catch(err){ console.error("Errore pulizia prenotazioni:", err); }
}
setInterval(cleanupBookings, 24*60*60*1000);

// --- LAVORA CON NOI ---
const upload = multer({
  storage: multer.diskStorage({
    destination: (req,file,cb)=>{ const dir="./uploads"; if(!fs.existsSync(dir)) fs.mkdirSync(dir); cb(null,dir); },
    filename: (req,file,cb)=>cb(null,Date.now()+"-"+file.originalname)
  })
});
app.get("/lavora-con-noi",(req,res)=>res.sendFile(path.join(__dirname,"views","lavora-con-noi.html")));
app.post("/lavora", upload.single("cv"), async (req,res)=>{
  const { nome,email,esperienze,motivazione,ruolo } = req.body;
  const file = req.file ? [{ content: fs.readFileSync(req.file.path).toString("base64"), filename: req.file.originalname, type: req.file.mimetype, disposition:'attachment'}] : [];
  await sendEmail("info@abatel.org", `💼 Nuova candidatura da ${nome}`, `Nuova candidatura ricevuta!\nNome: ${nome}\nEmail: ${email}\nEsperienze: ${esperienze}\nMotivazione: ${motivazione}\nRuolo: ${ruolo}`, file);
  res.send("✅ Candidatura inviata con successo!");
});

// --- Avvio server ---
const PORT = process.env.PORT || 10000;
app.listen(PORT,()=>console.log(`✅ Server online sulla porta ${PORT}`));
