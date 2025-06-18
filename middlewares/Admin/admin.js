const authorizeAdmin = (req, res, next) => {
  console.log('lllll')
const role= req.user.role
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
  };
  
  module.exports = authorizeAdmin;
  