const express = require('express');
const httpErrors = require('http-errors');
const config = require('config');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const logger = require('./logger/logger');
const sequelize = require('./config/db');

const app = express();

// Documentation
const swaggerDocument = YAML.load('./docs/swagger.yaml');

sequelize.authenticate()
  .then(() => logger.info('Connected to MySQL database'))
  .catch(err => logger.error('Unable to connect to the database:', err));

// Cross Origin Resource Sharing
const corsOptions = {
  origin: ['http://nyelvszo.eu', 'https://nyelvszo.eu'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan('combined', { stream: logger.stream }));
app.use(express.static('public'));
app.use(bodyParser.json());

const authenticateJwt = require('./models/auth/authenticate');

app.use('/entries', require('./controllers/entry/router'));
app.use('/versionhistory', require('./controllers/entry/router'));
app.use('/contact', require('./controllers/entry/router'));
app.use('/preface', require('./controllers/entry/router'));
app.use('/users', authenticateJwt, require('./controllers/user/router'));
app.use('/login', require('./controllers/login/router'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', (req, res, next) => {
  console.log(req.url);
  res.send('The NyelvSzó v.2.0.0 backend is working!');
});

app.use((err, req, res, next) => {
  res.status = 500;
  res.json({
    hasError: true,
    message: err.message,
  });
});

module.exports = app;