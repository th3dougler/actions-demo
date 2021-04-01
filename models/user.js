var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: String,
    givenName: String,
    familyName: String,
    email: String,
    picture: String,
    googleId: String,
},{
    timestamps: true,
})

module.exports = mongoose.model("User", userSchema);