const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema ({
    user: { type: String },
    xp: { type: Number, default: 1},
    level: { type: Number, default: 1 },
    rep: { type: Number, default: 0 },
    xpToLevel: { type: Number, default: 0 },
    repCooldown: { type: Number, default: 0},
}) 


module.exports = mongoose.model('User', userSchema);