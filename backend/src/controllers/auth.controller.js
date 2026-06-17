const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthUserModel = require("../model/user.model");
const blackListModel = require("../model/blacklist.model")
const { ReturnDocument } = require("mongodb");
// ======================
// REGISTER USER
// ======================
async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await AuthUserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username or Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await AuthUserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign(
      {
        id: newUser._id,
        username: newUser.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        // HTTPS must
      sameSite: "none",    // critical for cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// ======================
// LOGIN USER
// ======================
async function loginUserController(req, res) {
  try {
    const { username, email, password } = req.body;

    // Validation
    if ((!username && !email) || !password) {
      return res.status(400).json({
        success: false,
        message: "Username/Email and Password are required",
      });
    }

    // Find user
    const user = await AuthUserModel.findOne({
      $or: [{ username }, { email }],
    }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        // HTTPS must
      sameSite: "none",    // critical for cross-site cookies
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error); 

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async function getMEUserController(req, res) {
  const user = await AuthUserModel
    .findById(req.user.id)
    .select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user: user,
  });
}


async function logOutUserController(req, res) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token not found",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    await blackListModel.create({ token });


     res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  registerUserController,
  loginUserController,
  getMEUserController,
  logOutUserController
};