// server.js
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Database PostgreSQL ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// --- Middleware ---
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // CV

// --- EMAIL FORM ---
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "contatti.html"));
});

app.post("/send", async (req, res) => {
  const { nome, email, messaggio } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Nuovo messaggio da ${nome}`,
    text: messaggio
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
app.get("/api/bookings", async (_, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookings ORDER BY date, time");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nel DB" });
  }
});

app.post("/api/bookings", async (req, res) => {
  const { name, email, date, time } = req.body;
  if (!date) return res.json({ success: false, error: "Data mancante" });

  try {
    await pool.query(
      "INSERT INTO bookings (name, email, date, time) VALUES ($1,$2,$3,$4)",
      [name || null, email || null, date, time || null]
    );
    console.log(`📅 Nuova prenotazione: ${date} alle ${time} - ${name}`);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Errore nel DB" });
  }
});

app.delete("/api/bookings/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query("DELETE FROM bookings WHERE id=$1", [id]);
    console.log(`❌ Prenotazione eliminata: ${id}`);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Errore nel DB" });
  }
});

// --- CREA TABELLA BOOKINGS (temporaneo) ---
app.get("/create-bookings-table", async (_, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255),
        date DATE NOT NULL,
        time VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    res.send("✅ Tabella bookings creata!");
    console.log("✅ Tabella bookings creata!");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Errore nella creazione della tabella");
  }
});

// --- LAVORA CON NOI ---
const upload = multer({
  storage: multer.diskStorage({
    destination: (_, file, cb) => {
      const dir = "./uploads";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      cb(null, dir);
    },
    filename: (_, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    }
  })
});

app.get("/lavora-con-noi", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "lavora-con-noi.html"));
});

app.post("/lavora", upload.single("cv"), async (req, res) => {
  const { nome, email, esperienze, motivazione, ruolo } = req.body;
  const file = req.file ? path.join(__dirname, req.file.path) : null;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  let mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
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

// --- Avvia server ---
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
