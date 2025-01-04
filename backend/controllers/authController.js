const dynamoDb = require("../config/dynamoDbConfig");
const { hashPassword, comparePassword } = require("../utils/hashUtils");
const jwt = require("jsonwebtoken");


const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const params = {
      TableName: process.env.TABLE_NAME_USERS,
      Key: { email },
    };

    const { Item } = await dynamoDb.get(params).promise();
    if (Item) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Save user to database
    const newUser = {
      email,
      name,
      role,
      password: hashedPassword,
    };

    const saveParams = {
      TableName: process.env.TABLE_NAME_USERS,
      Item: newUser,
    };

    await dynamoDb.put(saveParams).promise();

    res.status(201).json({ message: "User signed up successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error signing up" });
  }
};

const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if user exists
    const params = {
      TableName: process.env.TABLE_NAME_USERS,
      Key: { email },
    };

    const { Item } = await dynamoDb.get(params).promise();
    if (!Item || Item.role !== role) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await comparePassword(password, Item.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

module.exports = { signup, login };
