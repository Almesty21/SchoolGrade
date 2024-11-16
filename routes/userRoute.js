const express = require('express');
const userRouter = express();
const { register, createSuperAdmin, login, loggedinUser, getAllUsers, logout, editUser, deleteUser } = require('../controller/usersController');
const authToken = require('../middleware/authToken');
const checkRole = require('../middleware/checkRole');

// Create superadmin route (This should be called only once to set up the initial superadmin)
userRouter.post('/create-superadmin', createSuperAdmin);

// Register route
userRouter.post('/register', authToken, checkRole('admin', 'superadmin'), register);

// Login route
userRouter.post('/login', login);

// Get user info route
userRouter.get('/loggedin-user', authToken, loggedinUser);

// Get all users route (for admin and superadmin)
userRouter.get('/get-users', authToken, checkRole('admin', 'superadmin'), getAllUsers);

// Logout route
userRouter.post('/logout', authToken, logout);

// Edit user (Admin and Superadmin)
userRouter.put('/edit/:id', authToken, checkRole('admin', 'superadmin'), editUser);

// Delete user (Superadmin only)
userRouter.delete('/delete/:id', authToken, checkRole('admin, superadmin'), deleteUser);

module.exports = userRouter;
