const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// In-memory user store (replace with database in production)
const users = new Map();

// Passport configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${
        process.env.BASE_URL || "http://localhost:3001"
      }/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = users.get(profile.id);

        if (!user) {
          // Create new user
          user = {
            id: profile.id,
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            createdAt: new Date().toISOString(),
          };

          users.set(profile.id, user);
          console.log(`New user created: ${user.name} (${user.email})`);
        } else {
          // Update existing user info
          user.name = profile.displayName;
          user.email = profile.emails[0].value;
          user.avatar = profile.photos[0].value;
          users.set(profile.id, user);
          console.log(`User updated: ${user.name} (${user.email})`);
        }

        return done(null, user);
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
passport.deserializeUser((id, done) => {
  const user = users.get(id);
  done(null, user || null);
});

module.exports = passport;
