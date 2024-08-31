const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const logger = require('./logger/logger');

const app = express();

const swaggerDocument = YAML.load('./docs/swagger.yaml');

const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim()) : '*',
  optionsSuccessStatus: 200,
  credentials: true, // Ha szükséges
};

app.use(cors(corsOptions));
app.use(morgan('combined', {
  stream: logger.stream,
}));
app.use(express.static('public'));
app.use(express.json());

const authenticateJwt = require('./models/auth/authenticate');

app.use('/entries', require('./controllers/entry/router'));
app.use('/versionhistory', require('./controllers/entry/router'));
app.use('/contact', require('./controllers/entry/router'));
app.use('/preface', require('./controllers/entry/router'));
app.use('/users', require('./controllers/user/router'));
app.use('/login', require('./controllers/login/router'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Üdvözlő végpont hozzáadása
app.get('/', (req, res) => {
  res.send('Üdvözöljük! A backend működik.');
});

app.use((err, req, res, next) => {
  logger.error(`Internal Server Error: ${err.message}`);
  res.status(500).json({
    hasError: true,
    message: err.message,
  });
});

app.use((req, res, next) => {
  console.log(`Beérkező kérés: ${req.method} ${req.url}`);
  next();
});

// Az útvonalak regisztrálása után
console.log('Regisztrált útvonalak:', app._router.stack.filter(r => r.route).map(r => r.route.path));

module.exports = app;