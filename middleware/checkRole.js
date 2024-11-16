// function checkRole(...roles) {
//   return (req, res, next) => {
//     console.log('User role:', req.user?.role); // Log the user's role
//     if (!req.user || !roles.includes(req.user.role)) {
//       console.log('Role check failed. Required roles:', roles);
//       return res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
//     }
//     next();
//   };
// }

// module.exports = checkRole;

const User = require('../models/user');

function checkRole(...roles) {
  return async (req, res, next) => {
    try {
      const user = req.user; // AuthToken middleware sets req.user

      if (!user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      if (roles.includes(user.role)) {
        // User has one of the required roles
        return next();
      }

      // For the delete operation, check if the user is an admin and the target user is a regular user
      if (req.method === 'DELETE') {
        const targetUserId = req.params.id;
        const targetUser = await User.findById(targetUserId);

        if (user.role === 'admin' && targetUser.role === 'user') {
          // Admin can delete a user
          return next();
        }

        if (user.role === 'superadmin') {
          // Superadmin can delete any user
          return next();
        }
      }

      return res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}

module.exports = checkRole;



