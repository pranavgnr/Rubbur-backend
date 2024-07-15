const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const documentSchema = new Schema({
    data: {
        required: true,
        type: Schema.Types.Mixed
    },
    subBooks: {
        required: false,
        type: [Schema.Types.ObjectId]
    },
    parentId: {
        required: true,
        type: Schema.Types.ObjectId
    }
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;