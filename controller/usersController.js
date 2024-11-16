const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  console.log('Register endpoint hit');
  console.log('Request body:', req.body);

  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    // Default role if none is provided
    let userRole = 'user';

    if (req.user) {
      // If the requester is an admin
      if (req.user.role === 'admin') {
        if (role && role !== 'user') {
          return res.status(403).json({ message: 'Admins can only create users.' });
        }
        userRole = 'user'; // Admins can only create users with the 'user' role
      }
      // If the requester is a superadmin
      else if (req.user.role === 'superadmin') {
        if (role && (role === 'admin' || role === 'superadmin')) {
          userRole = role; // Superadmins can assign roles 'admin' and 'superadmin'
        } else if (!role) {
          userRole = 'user'; // Default to 'user' if no role is provided
        }
      } else {
        return res.status(403).json({ message: 'You do not have permission to assign roles.' });
      }
    } else {
      // If no user is authenticated, return an unauthorized error
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Ensure the role is not allowed if set
    if (req.user.role === 'admin' && role && role !== 'user') {
      return res.status(403).json({ message: 'Admins can only create users.' });
    } else if (req.user.role === 'superadmin' && role && !['user', 'admin', 'superadmin'].includes(role)) {
      return res.status(403).json({ message: 'Invalid role assignment.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: `User with username ${username} already exists.` });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: userRole // Use determined userRole
    });

    const user = await newUser.save();
    res.json(user);

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

// Create SuperAdmin
exports.createSuperAdmin = async (req, res) => {
  try {
    // Check if any superadmin already exists
    const existingSuperadmin = await User.findOne({ role: 'superadmin' });
    if (existingSuperadmin && (!req.user || req.user.role !== 'superadmin')) {
      return res.status(403).json('Only superadmins can create other superadmins.');
    }

    const { username, email, password } = req.body;

    // Check if the superadmin user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(203).json('Superadmin already exists.');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the superadmin user
    const newSuperadmin = new User({
      username,
      email,
      password: hashedPassword,
      role: 'superadmin',
    });

    const user = await newSuperadmin.save();
    res.json(user);
  } catch (error) {
    res.status(400).json(`Error: ${error.message}`);
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'UserController: User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { _id: user._id, role: user.role };
    console.log('Token payload:', payload); // Log the payload

    const token = jwt.sign(
      payload,
      process.env.TOKEN_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged-in user's information
exports.loggedinUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(['_id', 'username', 'email', 'role']);
    res.json(user);
  } catch (error) {
    res.status(400).json(`Error: ${error.message}`);
  }
};

// Get all users route (for admin and superadmin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(400).json(`Error: ${error.message}`);
  }
};

// Logout user
exports.logout = (req, res) => {
  try {
    res.clearCookie('token'); // Clear the token cookie
    res.json('Logged out successfully');
  } catch (error) {
    res.status(500).json(`Error: ${error.message}`);
  }
};

// Edit user (Admin and Superadmin)
exports.editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    res.json(user);
  } catch (error) {
    res.status(400).json(`Error: ${error.message}`);
  }
};

// Delete user (Superadmin only)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log('id in deleteUser', id);

  try {
    const user = await User.findByIdAndDelete(id);
    console.log("User will be deleted: " + user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
