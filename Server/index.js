const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const EmployeeModel = require('./models/Employee')
const bcrypt = require("bcryptjs");
const foodRoutes = require("./routes/foodRoutes"); // Import food routes

// require('dotenv').config()
// const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors())

mongoose.connect("mongodb+srv://nikhilkumawat7689:nikhilkumawat7689@cluster0.euhw9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));
app.get("/", (req, res) => {
    res.send("<h1>Hi</h1>");
});


// const JWT_SECRET = "your_secret_key"; 

// Signup Page
app.post("/employee", async (req, res) => {
    try {
        // Create a new user
        const { username, email, password } = req.body

        // Check if user already exists
        const existingUser = await EmployeeModel.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already registered" });

        const hasedPass = await bcrypt.hash(password, 10)

        const newUser = new EmployeeModel({ username, email, password: hasedPass, })
        await newUser.save()
        // console.log("new user registered successfully...")
        res.status(201).json({ message: "New user registered successfully" });

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

// Login Page
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        // Find user by email
        const employee = await EmployeeModel.findOne({ email })
        // If user not exist
        if (!employee) {
            return res.status(404).json({ error: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Successful login
        res.json({
            message: "Login successful",
            user: {
                id: employee._id,
                username: employee.username,
                email: employee.email,
            },
        })
    } catch (err) {
        res.status(500).json({ error: "Server error" })
    }
})

app.put("/update_password", async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        // Find user by email
        const employee = await EmployeeModel.findOne({ email });
        if (!employee) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if old password is correct
        const isMatch = await bcrypt.compare(oldPassword, employee.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Old password is incorrect" });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        employee.password = hashedNewPassword;
        await employee.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error("Password update error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// Register Food Routes
app.use("/api", foodRoutes);
app.listen(5000, () => console.log("Server running on port 5000"));
