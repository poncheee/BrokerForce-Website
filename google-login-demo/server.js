const express = require("express");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

// Import passport configuration
require("./config/passport");

// Initialize database connection
const { query, initializeSchema } = require("./db");

const app = express();

// Initialize database schema on startup (idempotent - safe to run multiple times)
// Note: For existing databases, you may need to run the migration script:
// node -e "require('./db/index').query(require('fs').readFileSync('./db/migrate_add_username_password.sql', 'utf8')).then(() => console.log('Migration complete')).catch(console.error)"
initializeSchema().catch((err) => {
  console.error(
    "⚠️  Warning: Could not initialize database schema:",
    err.message
  );
  console.log(
    "💡 You may need to initialize the schema manually: node db/init.js"
  );
  console.log(
    "💡 For existing databases, run the migration: Check migrate_add_username_password.sql"
  );
});
const PORT = process.env.PORT || 3001;

// Trust proxy - Required for Railway/production environments
// This allows Express to correctly detect HTTPS and set secure cookies
app.set("trust proxy", 1);

// Middleware
// CORS configuration - allow requests from frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Get allowed origins from environment
    const frontendUrl = process.env.FRONTEND_URL;

    // Normalize URLs (remove trailing slashes, convert to lowercase for comparison)
    const normalizeUrl = (url) => {
      if (!url) return null;
      return url.replace(/\/+$/, "").toLowerCase();
    };

    const allowedOrigins = [
      frontendUrl,
      "http://localhost:5173", // Development
      "http://localhost:3000", // Development
      "https://brokerforce.ai", // Production frontend
      "https://www.brokerforce.ai", // Production frontend with www
      "https://brokerforce.netlify.app", // Netlify frontend (if using Netlify subdomain)
    ]
      .filter(Boolean) // Remove undefined values
      .map(normalizeUrl); // Normalize all URLs

    const normalizedOrigin = normalizeUrl(origin);

    // Log for debugging
    console.log(
      `CORS check - Origin: ${origin} (normalized: ${normalizedOrigin}), Allowed: ${allowedOrigins.join(
        ", "
      )}, FRONTEND_URL: ${frontendUrl}`
    );

    // In production, check against allowed origins
    if (process.env.NODE_ENV === "production") {
      // Allow requests with no origin (same-origin, mobile apps, curl, etc.)
      if (!origin) {
        console.log("CORS: Allowing request with no origin");
        return callback(null, true);
      }

      // Check if origin is in allowed list (normalized comparison)
      if (allowedOrigins.some((allowed) => normalizedOrigin === allowed)) {
        console.log(`CORS: Allowing origin: ${origin}`);
        return callback(null, true);
      }

      // Origin not allowed
      console.warn(
        `CORS: Blocked origin: ${origin} (normalized: ${normalizedOrigin}, allowed: ${allowedOrigins.join(
          ", "
        )})`
      );
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    } else {
      // In development, allow all origins
      console.log("CORS: Development mode - allowing all origins");
      callback(null, true);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Type"],
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session configuration
// Determine if we're in production (for cookie settings)
// Check NODE_ENV first, then fall back to checking if URLs are HTTPS
const isProduction =
  process.env.NODE_ENV === "production" ||
  (process.env.BASE_URL && process.env.BASE_URL.startsWith("https://")) ||
  (process.env.FRONTEND_URL && process.env.FRONTEND_URL.startsWith("https://"));

console.log("Session configuration:", {
  NODE_ENV: process.env.NODE_ENV,
  BASE_URL: process.env.BASE_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
  isProduction: isProduction,
  cookieSecure: isProduction,
  cookieSameSite: isProduction ? "none" : "lax",
});

app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "your-super-secret-session-key-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: {
      // For cross-origin cookies (Railway backend -> Netlify frontend):
      // - secure MUST be true when using sameSite: "none"
      secure: isProduction,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      // Use "none" for cross-origin cookies in production
      // Use "lax" for localhost development
      sameSite: isProduction ? "none" : "lax",
      // Don't set domain - let browser handle it for cross-origin cookies
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/api/auth", require("./routes/authLocal"));
app.use("/api", require("./routes/api"));
app.use("/api/favorites", require("./routes/favorites"));
app.use("/api/purchases", require("./routes/purchases"));
app.use("/api/offers", require("./routes/offers"));
app.use("/api/documents", require("./routes/documents"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/dashboard", require("./routes/dashboard"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Backend API server - frontend is served separately (Netlify)
// Show simple info page for root route
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>BrokerForce API Server</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .container { text-align: center; }
            .info { background: #e3f2fd; color: #1565c0; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔐 BrokerForce API Server</h1>
            <div class="info">
                <p><strong>Backend API is running</strong></p>
                <p>Frontend is served separately on Netlify</p>
                <p>Environment: ${process.env.NODE_ENV || "development"}</p>
            </div>
            <p><a href="/health">Health Check</a> | <a href="/api/me">API Test</a></p>
        </div>
    </body>
    </html>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Internal server error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server and initialize database
// Railway requires binding to 0.0.0.0 to accept external connections
const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

app.listen(PORT, HOST, async () => {
  console.log(`🚀 BrokerForce Auth Server running on ${HOST}:${PORT}`);
  console.log(
    `📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`
  );
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
  const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
  console.log(`🔗 Base URL: ${baseUrl}`);
  console.log(`🔗 Health check: ${baseUrl}/health`);
  console.log(`🔗 API endpoint: ${baseUrl}/api/me`);

  try {
    await initializeSchema(); // Initialize database schema on startup
    console.log("✅ Database schema initialized successfully!");
  } catch (error) {
    console.error("❌ Failed to initialize database schema on startup:", error);
    // Do not exit, allow server to start even if schema init fails (e.g., already exists)
  }
});
