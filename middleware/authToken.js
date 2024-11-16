// authToken.js
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function authToken(req, res, next) {
  try {
    // Retrieve token from cookies or authorization headers
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    console.log("Token from request:", token); // Log the token

    // Check if token exists
    if (!token) {
      return res.status(401).json({ message: "Please login.", error: true, success: false });
    }

    // Verify token
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.log('Token verification error:', err);
        return res.status(401).json({ message: 'Unauthorized access.' });
      }

      // Log decoded payload
      console.log('Decoded token payload:', decoded); 

      // Ensure `id` is properly accessed from decoded token
      const userId = decoded._id;
      console.log('User ID:', userId); // Log user ID
       
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log('Invalid ObjectId format:', userId);
        return res.status(401).json({ message: 'Invalid user ID format.' });
      }

      // Convert to ObjectId and find user
      const user = await User.findById(userId);
      console.log("User from DB:", user); // Log user fetched from DB

      if (!user) {
        return res.status(401).json({ message: 'AuthToken: User not found.' });
      }

      // Attach user object to the request
      req.user = user; 
      console.log('Authenticated user:', req.user); // Log user details

      next();
    });
  } catch (err) {
    console.error('Error in authToken middleware:', err);
    res.status(400).json({ message: err.message || err, error: true, success: false });
  }
}

module.exports = authToken;
