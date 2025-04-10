import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

const tokenBlacklist = new Map();

// Configure Passport
const configurePassport = () => {
  
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    scope: ["profile", "email"]
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ where: { email: profile.emails[0].value } });
      
      if (!user) {
        user = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          password_hash: null,
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));

  // GitHub OAuth Strategy
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback",
    scope: ["user:email"]
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // GitHub may not return email in profile
      const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
      
      let user = await User.findOne({ where: { email } });
      
      if (!user) {
        // Create new user if doesn't exist
        user = await User.create({
          username: profile.username,
          email,
          password_hash: null, 
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

configurePassport();

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

// Blacklist tokens
const blacklistToken = (token, expiresIn) => {
  const expiryDate = Date.now() + expiresIn * 1000; 
  tokenBlacklist.set(token, expiryDate);
};

// Check if token is blacklisted
const isTokenBlacklisted = (token) => {
  if (tokenBlacklist.has(token)) {
    const expiry = tokenBlacklist.get(token);
    if (Date.now() < expiry) {
      return true; 
    }
    tokenBlacklist.delete(token); 
  }
  return false;
};

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username, email, and password" });
    }

    // Check if user already exists
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already in taken" });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already in use" });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password_hash: password, 
    });

    const { accessToken, refreshToken } = generateTokens(user.id);

    // Set HTTP-only cookie for refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(201).json({
      message: "User registered successfully",
      accessToken,
      user: {
        id: user.id,
        username,
        email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password using the instance method
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Set HTTP-only cookie for refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];
    const refreshToken = req.cookies.refreshToken;

    if (accessToken) {
      const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
      const expiresIn = decodedToken.exp - Math.floor(Date.now() / 1000);
      blacklistToken(accessToken, expiresIn > 0 ? expiresIn : 0);
    }

    if (refreshToken) {
      const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const refreshExpiresIn = decodedRefresh.exp - Math.floor(Date.now() / 1000);
      blacklistToken(refreshToken, refreshExpiresIn > 0 ? refreshExpiresIn : 0);
      res.clearCookie("refreshToken"); 
    }

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Social login success callback
export const socialLoginCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Social authentication failed" });
    }

    const user = req.user;
    const { accessToken, refreshToken } = generateTokens(user.id);

    // Set HTTP-only cookie for refresh token
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend with tokens in query params
    res.redirect(`${process.env.FRONTEND_URL}/auth/success?accessToken=${accessToken}&userId=${user.id}`);
  } catch (error) {
    console.error("Social login callback error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
  }
};

// Initiate Google 
export const googleAuth = passport.authenticate("google", {
  session: false,
});

// Google OAuth 
export const googleAuthCallback = passport.authenticate("google", {
  session: false,
  failureRedirect: "/login",
});

// Initiate GitHub 
export const githubAuth = passport.authenticate("github", {
  session: false,
});

// GitHub  callback
export const githubAuthCallback = passport.authenticate("github", {
  session: false,
  failureRedirect: "/login",
});