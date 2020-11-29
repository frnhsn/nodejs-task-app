const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const user = require('../models/user');

// Loading environment varialbles
dotenv.config();
const secretKey = process.env.TOKEN_SECRET;

// Authentication middleware
const auth = async (req, res, next) => {
    try {
        // jwt.verify(res)
        // // await user.login('heru@internet.com','herucute');
    } catch (error) {
        console.log(error);  
    }

    next();
};

module.exports = auth;