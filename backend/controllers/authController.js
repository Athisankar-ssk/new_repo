import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.json({
      msg: "Login success",
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// GET USER DETAILS
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching user details" });
  }
};

// UPDATE USER DETAILS  ⭐ ADD THIS HERE
export const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (error) {
    res.status(500).json({ msg: "Update failed" });
  }
};

//Add Profile Image Upload

export const uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user);

    user.profileImage = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ profileImage: user.profileImage });
  } catch (error) {
    res.status(500).json({ msg: "Image upload failed" });
  }
};


//change password


export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Old password is incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Password update failed" });
  }
};


// delete account 

export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user);
    res.json({ msg: "Account deleted successfully" });
  } catch {
    res.status(500).json({ msg: "Delete failed" });
  }
};

export const updatePreferences = async (req, res) => {
  const { notifications } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user,
    { notifications },
    { new: true }
  );

  res.json(user);
};


