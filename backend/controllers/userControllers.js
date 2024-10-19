import TryCatch from '../utils/TryCatch.js'; 
import { User } from '../models/user.js';
// Import the User model
import bcrypt from 'bcrypt'; // For hashing passwords
import jwt from '../utils/generateToken.js'; // For generating JWTs
import generateToken from '../utils/generateToken.js';

//register user control
export const registerUser = TryCatch(async (req, res) => {
    const { name, email, password } = req.body;

    // Input validation (basic)
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Normalize email (e.g., convert to lowercase and trim)
    const normalizedEmail = email.trim().toLowerCase();

    // Check if the user already exists
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
        return res.status(400).json({
            message: "User already exists!"
        });
    }

    // Ensure strong password criteria (e.g., minimum length, complexity)
    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long"
        });
    }

    // Hash the password with a higher salt rounds (e.g., 12)
    const hashPassword = await bcrypt.hash(password, 12);

    // Create the user
    user = await User.create({
        name: name.trim(), // Trim name to remove extra spaces
        email: normalizedEmail,
        password: hashPassword,
    });

    // Generate JWT token and set it in response
    generateToken(user._id, res);

    // Send response
    res.status(201).json({
        user,
        message: "User Registered"
    });
});

// Login user controller
export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;

    // Normalize email (e.g., convert to lowercase and trim)
    const normalizedEmail = email.trim().toLowerCase();

    // Find the user by normalized email
    const user = await User.findOne({ email: normalizedEmail });

    // Implement a fixed response time to avoid timing attacks
    await bcrypt.hash(password, 10); // Dummy hash to match timing

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password" // General error message
        });
    }

    // Compare the hashed password with the stored password hash
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // If password doesn't match, return an error message
    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid email or password" // General error message
        });
    }

    // Generate JWT token and set it in response
    generateToken(user._id, res);

    // Send response
    res.status(200).json({
        user,
        message: "User Logged In"
    });
});

//profile controller

export const myProfile = TryCatch(async(req,res)=>{
    const user = await User.findById(req.user._id);

    res.json(user);
})

//logout controller

export const logoutUser = TryCatch(async(req,res)=>{
    res.cookie("token","",{maxAge:0});

    res.json({
        message:"Logout Successfully"
    })
})
//saveed to playlist

export const saveToPlaylist = TryCatch(async(req,res)=>{
    const user = await User.findById(req.user._id)

    if (user.playlist.includes(req.params.id)){
        const index = user.playlist.indexOf(req.params.id)
        user.playlist.splice(index, 1)
        await user.save();
        return res.json({
            message:"Removed from Playlist"
        })

    }
    user.playlist.push(req.params.id)
    await user.save();
        return res.json({
            message:"Added to Playlist"
        })
})