import express from 'express';
import morgan from 'morgan';
import colors from 'colors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';

import setupDBAssociations from './models/setupDBAssociations.js';

import notFoundMiddleware from './middlewares/notFound.middleware.js';
import errorMiddleware from './middlewares/error.middleware.js';

setupDBAssociations();

const app = express();

// Set static folder
app.use(express.static('public'));

if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}

// Enable CORS
const origin = [process.env.APP_URL];

app.use(
  cors({
    origin,
    credentials: true
  })
);

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Add security headers
app.use(helmet());

// Prevent HTTP parameters pollution
app.use(hpp());

import apiRoutes from './routes/api.route.js';
import siteRoutes from './routes/site.route.js';
import authRoutes from './routes/auth.route.js';

// Mount routers
app.use('/api', apiRoutes);
app.use('/site', siteRoutes);
app.use('/auth', authRoutes);

// Limit the number of requests per minute in prod mode
if (process.env.ENV === 'prod') {
  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: process.env.RATE_LIMIT
    })
  );
}

// Errors
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`[OK] Server running in ${process.env.ENV} mode on port ${process.env.PORT}`.green);
});
