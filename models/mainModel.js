const { Schema, mongo, default: mongoose } = require('mongoose');

const mainSchema = new Schema({
    documentIds: {
        type: [mongoose.Schema.Types.ObjectId],
        required: false
    }
})

module.exports = mongoose.model('Main',mainSchema);