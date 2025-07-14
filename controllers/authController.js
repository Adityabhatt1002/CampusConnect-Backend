const bcrypt = require("bcryptjs");
const User = require("../model/User");
const crypto= require("crypto");
const sendEmail = require("../util/sendEmail")
const generateToken = require("../util/generateToken");

// Signup Controller
const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Generate and send JWT token in cookie
    generateToken(res, user);

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate and send token
    generateToken(res, user);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


//Forgot Password
const forgotPassword= async(req,res)=>{
  const {email}=req.body;
  try{
    const user=await User.findOne({email});
    if(!user)
      return res.status(400).json({message:"User not found"});
       
    //Generate token
    const resetToken=crypto.randomBytes(20).toString("hex");
    
    user.resetTokenExpiry =Date.now() + 15*60*1000;
    await user.save();
    const resetUrl=`${process.env.CLIENT_URL}/reset-password/${resetToken}`
    
     const html = `
      <h2>Password Reset</h2>
      <p>Click below to reset your password. This link will expire in 15 minutes.</p>
      <a href="${resetUrl}" style="padding: 10px 15px; background: #2563eb; color: white; border-radius: 5px; text-decoration: none;">Reset Password</a>
      <p>If you did not request this, you can ignore this email.</p>
    `;
    await sendEmail({
      to:email,
      subject:"CampusConnect - Password Reset",
      html,
    });
    res.status(200).json({
      message:"Reset link sent to Email."
    });
  }
  catch(err){
    console.error("Forgot Password Error:",err);
    res.status(500).json({ message:"Failed to sent reset link"});
  }
}

//Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password" });
  }
};





module.exports = { signup, loginUser,forgotPassword ,resetPassword};
