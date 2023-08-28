const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['superadmin', 'admin'],
        required: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('Admin', adminSchema);
