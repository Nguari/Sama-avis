require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
const ticketsRouter = require('./routes/tickets');
const authRouter    = require('./routes/auth');

app.use('/api', ticketsRouter);
app.use('/api', authRouter);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Sama Avis API — en ligne' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});