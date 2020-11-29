const express = require('express');
const dotenv = require("dotenv");

// Configuring token variables
dotenv.config();
let token = process.env.TOKEN_SECRET;

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// Import routes
const indexRoutes = require('../routes/index.js');
const userRoutes = require('../routes/users.js');

app.use('', indexRoutes);
app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})