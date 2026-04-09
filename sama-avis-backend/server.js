require('dotenv').config();

const express     = require('express');
const cors        = require('cors');
const helmet      = require('helmet');
const compression = require('compression');
const rateLimit   = require('express-rate-limit');
const app         = express();

// Sécurité HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Compression gzip
app.use(compression());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Rate limiting global — plus permissif en développement
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de requêtes, réessayez dans 15 minutes.' }
}));

// Rate limiting strict auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 10 : 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de tentatives, réessayez dans 15 minutes.' }
});

// Routes
const ticketsRouter       = require('./routes/tickets');
const authRouter          = require('./routes/auth');
const commentairesRouter  = require('./routes/commentaires');
const categoriesRouter    = require('./routes/categories');
const notificationsRouter = require('./routes/notifications');
const historiqueRouter    = require('./routes/historique');
const mairieRouter        = require('./routes/mairie');
const temoignagesRouter   = require('./routes/temoignages');
const visitesRouter       = require('./routes/visites');

app.use('/api', ticketsRouter);
app.use('/api', authLimiter, authRouter);
app.use('/api', commentairesRouter);
app.use('/api', categoriesRouter);
app.use('/api', notificationsRouter);
app.use('/api', historiqueRouter);
app.use('/api', mairieRouter);
app.use('/api', temoignagesRouter);
app.use('/api', visitesRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Sama Avis API — en ligne', version: '1.0.0' });
});

// Route 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable' });
});

// Gestion d'erreurs globale
app.use((err, req, res, next) => {
  console.error('Erreur non gérée:', err);
  res.status(500).json({ message: 'Erreur serveur interne' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
