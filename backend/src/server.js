require('dotenv').config();
const brand = require('./config/brand');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');
const { ensureContentPages } = require('./utils/ensureContentPages');
const { ensureSiteSettings } = require('./utils/ensureSiteSettings');
const { repairCatalogue } = require('./utils/repairCatalogue');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const leadRoutes = require('./routes/leadRoutes');
const faqRoutes = require('./routes/faqRoutes');
const pageRoutes = require('./routes/pageRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

connectDB()
  .then(async () => {
    await Promise.all([ensureContentPages(), ensureSiteSettings()]);
    // One-shot: set REPAIR_CATALOGUE=true on Render, redeploy, then remove it.
    if (process.env.REPAIR_CATALOGUE === 'true') {
      await repairCatalogue({ connect: false });
      console.log('REPAIR_CATALOGUE finished — remove this env var from Render.');
    }
  })
  .catch((err) => {
    console.error('Failed to ensure default content:', err.message);
  });

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
function buildAllowedOrigins() {
  const origins = new Set(['http://localhost:3000']);
  const frontendUrl = process.env.FRONTEND_URL;

  if (frontendUrl) {
    origins.add(frontendUrl);

    try {
      const url = new URL(frontendUrl);
      if (url.hostname.startsWith('www.')) {
        origins.add(`${url.protocol}//${url.hostname.slice(4)}${url.port ? `:${url.port}` : ''}`);
      } else {
        origins.add(`${url.protocol}//www.${url.hostname}${url.port ? `:${url.port}` : ''}`);
      }
    } catch {
      // Ignore invalid FRONTEND_URL values.
    }
  }

  return origins;
}

const allowedOrigins = buildAllowedOrigins();

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  return /^https:\/\/[\w.-]+\.vercel\.app$/.test(origin);
};

app.use(cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, origin || true);
    } else {
      // Reject without throwing — a thrown error becomes a 500 without CORS
      // headers, which browsers surface as "Failed to fetch".
      callback(null, false);
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  // Render sits behind a proxy; avoid hard-failing on forwarded-for checks.
  validate: { xForwardedForHeader: false },
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'OPTIONS',
  validate: { xForwardedForHeader: false },
  message: { success: false, message: 'Too many form submissions, please try again later' },
});

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: `${brand.name} API is running` });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/leads/contact', formLimiter);
app.use('/api/leads/quotation', formLimiter);
app.use('/api/leads', leadRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/settings', settingsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Set PORT in backend/.env (macOS often uses 5000 for AirPlay).`);
    process.exit(1);
  }
  throw error;
});
