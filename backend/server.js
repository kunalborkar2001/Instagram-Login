const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors")
const app = express();

app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb+srv://kunalborkar2001:pveoINdiVlZx2wEm@kunalsmongo.5raphyd.mongodb.net/instagram', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define schema and model for user
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// Middleware
app.use(express.json());

// POST endpoint to store username and password
app.post('/api/user', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if user already exists
        let existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log(`User with username '${username}' already exists.`);
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Create a new user
        const newUser = new User({ username, password });
        await newUser.save();

        // Send response
        console.log(`New user created with username '${username}'.`);
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
