const express = require("express");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { query } = require("../db");
const passport = require("passport");

const router = express.Router();

// Username validation
const validateUsername = (username) => {
  if (!username || typeof username !== "string") {
    return { valid: false, error: "Username is required" };
  }
  if (username.length < 3 || username.length > 20) {
    return { valid: false, error: "Username must be between 3 and 20 characters" };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      valid: false,
      error: "Username can only contain letters, numbers, underscores, and hyphens",
    };
  }
  return { valid: true };
};

// Password validation with full requirements
const validatePassword = (password) => {
  if (!password || typeof password !== "string") {
    return { valid: false, error: "Password is required" };
  }
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: "Password must contain at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: "Password must contain at least one number" };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: "Password must contain at least one special character" };
  }
  return { valid: true };
};

// Check if username is available
// Query params: ?excludeUserId=<user_id> to exclude a specific user (for editing)
router.get("/check-username/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const excludeUserId = req.query.excludeUserId;

    const validation = validateUsername(username);
    if (!validation.valid) {
      return res.json({ available: false, error: validation.error });
    }

    // Check if username is taken by another user
    // Exclude NULL/empty usernames and optionally exclude a specific user ID
    let queryText = "SELECT id FROM users WHERE username = $1 AND username IS NOT NULL AND username != ''";
    const queryParams = [username.toLowerCase()];

    if (excludeUserId) {
      queryText += " AND id != $2";
      queryParams.push(excludeUserId);
    }

    const result = await query(queryText, queryParams);

    res.json({ available: result.rows.length === 0 });
  } catch (error) {
    console.error("Error checking username:", error);
    res.status(500).json({ error: "Failed to check username availability" });
  }
});

// Register new user with username/password
router.post("/register", async (req, res) => {
  try {
    const { username, password, firstName, lastName, email, linkToGoogleAccount } = req.body;

    // Validate input
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return res.status(400).json({ error: usernameValidation.error });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    if (!firstName || typeof firstName !== "string" || firstName.trim().length === 0) {
      return res.status(400).json({ error: "First name is required" });
    }

    if (!lastName || typeof lastName !== "string" || lastName.trim().length === 0) {
      return res.status(400).json({ error: "Last name is required" });
    }

    if (!email || typeof email !== "string" || email.trim().length === 0) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if username already exists (exclude NULL/empty usernames)
    const existingUsername = await query(
      "SELECT id FROM users WHERE username = $1 AND username IS NOT NULL AND username != ''",
      [username.toLowerCase()]
    );

    if (existingUsername.rows.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    // Check if email already exists with a Google account
    const existingGoogleUser = await query(
      "SELECT id, google_id, name, email, first_name, last_name FROM users WHERE email = $1 AND google_id IS NOT NULL",
      [normalizedEmail]
    );

    if (existingGoogleUser.rows.length > 0) {
      // User wants to link accounts
      if (linkToGoogleAccount === true) {
        const googleUser = existingGoogleUser.rows[0];

        // Check if username is already taken by another user (exclude NULL/empty usernames and current user)
        const usernameCheck = await query(
          "SELECT id FROM users WHERE username = $1 AND username IS NOT NULL AND username != '' AND id != $2",
          [username.toLowerCase(), googleUser.id]
        );

        if (usernameCheck.rows.length > 0) {
          return res.status(400).json({ error: "Username already taken" });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Link the accounts: add username and password to existing Google account
        // Use Google's first_name and last_name (Google takes precedence)
        // If Google doesn't have first/last name, use the form input as fallback
        const googleFirstName = googleUser.first_name || firstName.trim();
        const googleLastName = googleUser.last_name || lastName.trim();
        const googleFullName = googleUser.name || fullName;

        const result = await query(
          `UPDATE users
           SET username = $1, password_hash = $2, first_name = $3, last_name = $4, name = $5, updated_at = CURRENT_TIMESTAMP
           WHERE id = $6
           RETURNING id, username, first_name, last_name, name, email, avatar, google_id, created_at`,
          [
            username.toLowerCase(),
            passwordHash,
            googleFirstName,
            googleLastName,
            googleFullName,
            googleUser.id,
          ]
        );

        const user = result.rows[0];

        // Log in the user
        req.login(
          {
            id: user.id,
            username: user.username,
            name: user.name,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            avatar: user.avatar,
            googleId: user.google_id,
          },
          (err) => {
            if (err) {
              console.error("Login error after account linking:", err);
              return res.status(500).json({ error: "Account linking successful but login failed" });
            }
            res.json({
              success: true,
              linked: true,
              user: {
                id: user.id,
                username: user.username,
                name: user.name,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                avatar: user.avatar,
                googleId: user.google_id,
              },
            });
          }
        );
      } else {
        // User needs to confirm linking
        return res.status(200).json({
          needsLinking: true,
          message: `This email (${existingGoogleUser.rows[0].email}) is already associated with a Google account. Would you like to link your accounts? We'll add your username "${username}" and password to that account, and you'll be able to sign in with either Google or your username/password.`,
          existingUser: {
            email: existingGoogleUser.rows[0].email,
            name: existingGoogleUser.rows[0].name,
          },
        });
      }
    } else {
      // Check if email exists without Google account (regular username/password account)
      const existingEmail = await query(
        "SELECT id FROM users WHERE email = $1 AND google_id IS NULL",
        [normalizedEmail]
      );

      if (existingEmail.rows.length > 0) {
        return res.status(400).json({ error: "Email already registered" });
      }

      // Create new user
      const passwordHash = await bcrypt.hash(password, 10);
      const userId = uuidv4();
      const result = await query(
        `INSERT INTO users (id, username, password_hash, first_name, last_name, name, email, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING id, username, first_name, last_name, name, email, avatar, created_at`,
        [
          userId,
          username.toLowerCase(),
          passwordHash,
          firstName.trim(),
          lastName.trim(),
          fullName,
          normalizedEmail,
        ]
      );

      const user = result.rows[0];

      // Log in the user by creating a session
      req.login(
        {
          id: user.id,
          username: user.username,
          name: user.name,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          avatar: null,
          googleId: null,
        },
        (err) => {
          if (err) {
            console.error("Login error after registration:", err);
            return res.status(500).json({ error: "Registration successful but login failed" });
          }
          res.json({
            success: true,
            linked: false,
            user: {
              id: user.id,
              username: user.username,
              name: user.name,
              firstName: user.first_name,
              lastName: user.last_name,
              email: user.email,
              avatar: null,
            },
          });
        }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login with username/password
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Find user by username
    const result = await query(
      "SELECT id, username, password_hash, first_name, last_name, name, email, avatar, google_id, created_at FROM users WHERE username = $1",
      [username.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = result.rows[0];

    if (!user.password_hash) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Log in the user
    req.login(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        avatar: user.avatar,
        googleId: user.google_id,
        createdAt: user.created_at,
      },
      (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({ error: "Login failed" });
        }
        res.json({
          success: true,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            avatar: user.avatar,
            googleId: user.google_id,
          },
        });
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Link Google account to existing username/password account
router.post("/link-google", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // This endpoint should be called after Google OAuth completes
    // The user should already be logged in with username/password
    // We'll get the Google profile from the session or pass it as a parameter

    // For now, we'll handle this in the OAuth callback
    // This endpoint can be used if needed for a different flow
    res.json({ error: "Use Google OAuth to link account" });
  } catch (error) {
    console.error("Link Google error:", error);
    res.status(500).json({ error: "Failed to link Google account" });
  }
});

module.exports = router;
