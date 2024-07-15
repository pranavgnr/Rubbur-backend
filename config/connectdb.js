const mongoose = require('mongoose');

const connectdb = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('connection succesful');
    } catch (err) {
        console.log('failed with: ',err.message);
    }
}

module.exports = connectdb;