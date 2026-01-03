const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { query } = require("../db");

// Passport configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: (() => {
        const baseUrl = process.env.BASE_URL || "http://localhost:3001";
        // Ensure protocol is included
        const url =
          baseUrl.startsWith("http://") || baseUrl.startsWith("https://")
            ? baseUrl
            : `https://${baseUrl}`;
        return `${url}/auth/google/callback`;
      })(),
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleEmail = profile.emails[0].value.toLowerCase();

        // Check if user already exists with this Google ID
        const existingGoogleUser = await query(
          "SELECT * FROM users WHERE google_id = $1",
          [profile.id]
        );

        // Check if user exists with this email (for account linking)
        const existingEmailUser = await query(
          "SELECT * FROM users WHERE email = $1 AND google_id IS NULL",
          [googleEmail]
        );

        let user;

        if (existingGoogleUser.rows.length > 0) {
          // User already has Google account - update info
          // Parse display name into first and last name
          const nameParts = profile.displayName.split(" ");
          const firstName = nameParts[0] || profile.displayName;
          const lastName = nameParts.slice(1).join(" ") || "";

          const result = await query(
            `UPDATE users
             SET name = $1, first_name = $2, last_name = $3, email = $4, avatar = $5, updated_at = CURRENT_TIMESTAMP
             WHERE google_id = $6
             RETURNING *`,
            [
              profile.displayName,
              firstName,
              lastName,
              googleEmail,
              profile.photos[0]?.value || null,
              profile.id,
            ]
          );
          user = result.rows[0];
          console.log(`Google user updated: ${user.name} (${user.email})`);
        } else if (existingEmailUser.rows.length > 0) {
          // Account linking: User has username/password account with same email
          // Link Google account to existing account
          const existingUser = existingEmailUser.rows[0];

          // Check if account already has Google ID (all fields filled)
          // If so, don't allow changes - account is already fully linked
          if (existingUser.google_id) {
            // Account already has Google ID, just update info but don't change google_id
            const nameParts = profile.displayName.split(" ");
            const firstName = nameParts[0] || profile.displayName;
            const lastName = nameParts.slice(1).join(" ") || "";

            const result = await query(
              `UPDATE users
               SET name = $1, first_name = $2, last_name = $3, avatar = COALESCE($4, avatar), updated_at = CURRENT_TIMESTAMP
               WHERE id = $5
               RETURNING *`,
              [
                profile.displayName,
                firstName,
                lastName,
                profile.photos[0]?.value || existingUser.avatar,
                existingUser.id,
              ]
            );
            user = result.rows[0];
            console.log(`Google account info updated for existing linked user: ${user.name} (${user.email})`);
          } else {
            // Account doesn't have Google ID yet - link it
            // Google's first_name and last_name take precedence (always use Google names)
            const nameParts = profile.displayName.split(" ");
            const firstName = nameParts[0] || profile.displayName;
            const lastName = nameParts.slice(1).join(" ") || "";

            const result = await query(
              `UPDATE users
               SET google_id = $1, name = $2, first_name = $3, last_name = $4, avatar = COALESCE($5, avatar), updated_at = CURRENT_TIMESTAMP
               WHERE id = $6
               RETURNING *`,
              [
                profile.id,
                profile.displayName,
                firstName,
                lastName,
                profile.photos[0]?.value || existingUser.avatar,
                existingUser.id,
              ]
            );
            user = result.rows[0];
            console.log(`Google account linked to existing user: ${user.name} (${user.email})`);
          }
        } else {
          // Create new user with Google account
          const { v4: uuidv4 } = require("uuid");
          const userId = uuidv4();
          // Parse display name into first and last name
          const nameParts = profile.displayName.split(" ");
          const firstName = nameParts[0] || profile.displayName;
          const lastName = nameParts.slice(1).join(" ") || "";

          const result = await query(
            `INSERT INTO users (id, google_id, name, first_name, last_name, email, avatar, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
             RETURNING *`,
            [
              userId,
              profile.id,
              profile.displayName,
              firstName,
              lastName,
              googleEmail,
              profile.photos[0]?.value || null,
            ]
          );
          user = result.rows[0];
          console.log(`New Google user created: ${user.name} (${user.email})`);
        }

        // Transform database user to expected format
        const userObj = {
          id: user.id,
          googleId: user.google_id,
          username: user.username,
          name: user.name || (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null),
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.created_at,
        };

        return done(null, userObj);
      } catch (error) {
        console.error("Passport strategy error:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const result = await query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return done(null, null);
    }

    const user = result.rows[0];
    const userObj = {
      id: user.id,
      googleId: user.google_id,
      username: user.username,
      name: user.name || (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null),
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.created_at,
    };

    done(null, userObj);
  } catch (error) {
    console.error("Deserialize user error:", error);
    done(error, null);
  }
});

module.exports = passport;
