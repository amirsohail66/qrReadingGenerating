const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imagePath: String, // New field to store the image path
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    image_type: {
        type: Number,
        enum: [0 , 1],
        default: 0
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Upload', uploadSchema);
