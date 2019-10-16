require('dotenv').config()

import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import path from 'path';
import internalApi from './api/internal/index';
import http from 'http';
// import publicApi from './api/public/index';
// import { getCsrfProtection, csrfToken } from 'server/middlewares/csrf';

var debug = require('debug')('test:server');

const now = new Date();
const rootApp = express();
const app = express();

app.disable('x-powered-by');

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use((req, res, next) => {
  req.headers['user-agent'] = `${req.headers['user-agent']}`.substr(0, 150);
  next();
});
app.use(compression());
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  bodyParser.json({
    limit: '150kb',
  }),
);

/* global GIT_SHORT */
const name = `${process.env.SESSION_STORE_PREFIX}_GIT_SHORT_sid`;
const ONE_AND_HALF_HOUR = 90 * 60 * 1000;
app.use((req, res, next) => {
  session({
    name,
    secret: process.env.SESSION_SECRET || 'ashvin',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: ONE_AND_HALF_HOUR,
      secure: false,
      httpOnly: true,
    },
  })(req, res, next);
});

app.use(helmet());

/**
 * Applciation Routes
 */

const tags = process.env.HEALTH_TAGS || 'unknown revision';
const date = `${now.toLocaleTimeString()} ${now.toLocaleDateString()}`;
app.get('/health', async (_req, res) =>
  res.json({
    status: 'OK',
    tags,
    date,
  }),
);

/**
 * Register API middleware
 */
// Rest APIz
app.use('/api', internalApi);

// public facing api for push updates
// app.use('/pub', publicApi);


// process.on('unhandledRejection', (reason, promise) => {
//   logger.error('Unhandled Rejection at:', {
//     err: (reason || {}).stack || reason,
//   });
// });

var port = normalizePort(process.env.APP_PORT || '3000');
app.set('port', port);

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

export default app;