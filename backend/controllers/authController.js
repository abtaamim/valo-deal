const userModel = require("../models/userModel.js");
const { comparePassword, hashPassword } = require("../helpers/authHelper.js");
const JWT = require("jsonwebtoken");

exports.registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    // Validations
    if (!name || !email || !password || !phone || !address || !answer) {
      return res.status(400).send({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: true,
        message: "Already registered. Please login.",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    console.log(hashedPassword);
    // Save user
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    // Compare passwords
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate Access token
    const token = await JWT.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "300s",
    });

    // Generate Refresh token
    const refreshToken = await JWT.sign({ _id: user._id, role: user.role }, process.env.REFRESH_SECRET, {
      expiresIn: "7d",
    });

    console.log(token, "\nrefresh:", refreshToken)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

exports.testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

exports.forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    // Validation
    if (!email || !answer || !newPassword) {
      return res.status(400).send({ message: "Email, answer, and new password are required" });
    }

    // Check user
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong email or answer",
      });
    }

    // Hash new password and update user
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });

    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

exports.updateProfileController = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    const userId = req.user._id; // Assuming you have user ID in the req.user from the middleware

    if (!name || !email || !phone || !address) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    user.name = name;
    user.email = email;
    user.phone = phone;
    user.address = address;

    await user.save();

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log('Update Profile Error:', error);
    res.status(500).send({ success: false, message: "Something went wrong", error });
  }
};
const createAccessToken = (_id, role) => {
  return JWT.sign({ _id,role }, process.env.JWT_SECRET, { expiresIn: '300s' })
}
exports.refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  //user have to login again
  if (!refreshToken) return res.status(401).json({ message: 'Unauthorized in refresh' })

  JWT.verify(
    refreshToken,
    process.env.REFRESH_SECRET,
    async (err, decoded) => {

      if (err) return res.status(401).json({ message: 'Forbidden in ref' })
      const foundUser = await userModel.findById(decoded?._id)
      if (!foundUser) return res.status(401).json({ message: 'Unauthorized no user found' })

      const accessToken = createAccessToken(foundUser._id, foundUser.role)
      res.json({
        accessToken,
        user: {
          _id: foundUser._id,
          name: foundUser.name,
          email: foundUser.email,
          phone: foundUser.phone,
          address: foundUser.address,
          role:foundUser.role
        },
      })
    })

}
exports.logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.refreshToken) return res.sendStatus(204)// no content
  const refreshToken = cookies.refreshToken;

  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true })
  res.json({ message: 'Cookie cleared' })
}
