import mongoose from 'mongoose';

// Define the user schema
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user",
       
    },
    playlist:[{
        type: String,
        required: true
    }]
    },
    {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create the User model
 export const User = mongoose.model('User', schema);


