//post.router.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const posts = await Post.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'username');

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching posts' });
  }
});

module.exports = router;
//verifytoken.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid token' });
  }
};
//server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
