const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
};