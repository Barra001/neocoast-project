const mongoose = require('mongoose');

async function connectToDB() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
}

const Post = mongoose.model('Post', { title: String, body: String });

module.exports = {
    connectToDB,
    Post
};