const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with database in production)
const users = [];
const companies = [];
const posts = [];

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: uuidv4(),
      email,
      firstName,
      lastName,
      password: hashedPassword,
      role: "user",
      subscription: "free",
      createdAt: new Date(),
      lastLoginAt: new Date(),
      isActive: true,
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id);

    // Remove password from response
    const { password: _, ...userResponse } = newUser;

    res.status(201).json({
      success: true,
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find((u) => u.email === email);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Update last login
    user.lastLoginAt = new Date();

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/api/auth/logout", authenticateToken, (req, res) => {
  // In a real app, you might want to blacklist the token
  res.json({ success: true, message: "Logged out successfully" });
});

app.get("/api/auth/me", authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const { password: _, ...userResponse } = user;
  res.json({ success: true, data: userResponse });
});

app.put("/api/auth/profile", authenticateToken, (req, res) => {
  const userIndex = users.findIndex((u) => u.id === req.user.userId);
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Update user data
  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
    updatedAt: new Date(),
  };

  const { password: _, ...userResponse } = users[userIndex];
  res.json({ success: true, data: userResponse });
});

// Company Routes
app.get("/api/companies", authenticateToken, (req, res) => {
  const userCompanies = companies.filter((c) => c.userId === req.user.userId);
  res.json({ success: true, data: userCompanies });
});

app.post("/api/companies", authenticateToken, (req, res) => {
  const newCompany = {
    id: uuidv4(),
    userId: req.user.userId,
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  companies.push(newCompany);
  res.status(201).json({ success: true, data: newCompany });
});

app.put("/api/companies/:id", authenticateToken, (req, res) => {
  const companyIndex = companies.findIndex(
    (c) => c.id === req.params.id && c.userId === req.user.userId
  );
  if (companyIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Company not found" });
  }

  companies[companyIndex] = {
    ...companies[companyIndex],
    ...req.body,
    updatedAt: new Date(),
  };

  res.json({ success: true, data: companies[companyIndex] });
});

app.delete("/api/companies/:id", authenticateToken, (req, res) => {
  const companyIndex = companies.findIndex(
    (c) => c.id === req.params.id && c.userId === req.user.userId
  );
  if (companyIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Company not found" });
  }

  companies.splice(companyIndex, 1);
  res.json({ success: true, message: "Company deleted successfully" });
});

// Posts Routes
app.get("/api/posts", authenticateToken, (req, res) => {
  const { companyId } = req.query;
  let userPosts = posts.filter((p) => p.userId === req.user.userId);

  if (companyId) {
    userPosts = userPosts.filter((p) => p.companyId === companyId);
  }

  res.json({ success: true, data: userPosts });
});

app.post("/api/posts", authenticateToken, (req, res) => {
  const newPost = {
    id: uuidv4(),
    userId: req.user.userId,
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  posts.push(newPost);
  res.status(201).json({ success: true, data: newPost });
});

app.put("/api/posts/:id", authenticateToken, (req, res) => {
  const postIndex = posts.findIndex(
    (p) => p.id === req.params.id && p.userId === req.user.userId
  );
  if (postIndex === -1) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  posts[postIndex] = {
    ...posts[postIndex],
    ...req.body,
    updatedAt: new Date(),
  };

  res.json({ success: true, data: posts[postIndex] });
});

app.delete("/api/posts/:id", authenticateToken, (req, res) => {
  const postIndex = posts.findIndex(
    (p) => p.id === req.params.id && p.userId === req.user.userId
  );
  if (postIndex === -1) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  posts.splice(postIndex, 1);
  res.json({ success: true, message: "Post deleted successfully" });
});

// AI Content Generation (Mock)
app.post("/api/ai/generate", authenticateToken, (req, res) => {
  const { prompt, platform, tone, length } = req.body;

  // Mock AI response
  const mockContent = `🚀 Exciting news! We're thriving in the ${platform} space with innovative solutions. Our ${tone} approach to ${prompt} is revolutionizing the industry. Stay tuned for more updates! #Innovation #Growth #${platform}`;

  res.json({
    success: true,
    data: {
      content: mockContent,
      hashtags: ["#Innovation", "#Growth", `#${platform}`],
      suggestions: [
        "Consider adding a call-to-action",
        "Include relevant industry hashtags",
        "Mention your unique value proposition",
      ],
    },
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
