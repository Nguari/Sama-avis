require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
const ticketsRouter       = require('./routes/tickets');
const authRouter          = require('./routes/auth');
const commentairesRouter  = require('./routes/commentaires');
const categoriesRouter    = require('./routes/categories');
const notificationsRouter = require('./routes/notifications');
const historiqueRouter    = require('./routes/historique');

app.use('/api', ticketsRouter);
app.use('/api', authRouter);
app.use('/api', commentairesRouter);
app.use('/api', categoriesRouter);
app.use('/api', notificationsRouter);
app.use('/api', historiqueRouter);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Sama Avis API — en ligne' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});