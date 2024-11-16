const express = require('express');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const routes = require('./routes');

const app = express();
console.log(process.env.MONGODB_URI);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_DASHBOARD_URL
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); // Ensure body parsing for JSON
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET_KEY || 'sessionsecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // Secure only in production (HTTPS)
        sameSite: 'Lax' // Adjust as necessary: 'Strict', 'Lax', or 'None'
    }
}));

app.use("/api", routes);

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    const { default: chalk } = await import('chalk');

    await connectDB();
    console.log(chalk.green('Connected to DB'));

    app.listen(PORT, () => {
      console.log(chalk.blue(`Server is running on port ${PORT}`));
    });
  } catch (err) {
    console.error(chalk.red('Failed to connect to DB:', err));
  }
}

startServer();
