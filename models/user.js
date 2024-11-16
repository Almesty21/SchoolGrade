const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    password : String,
    profilePic : String,
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
},{
    timestamps : true
})


const userModel =  mongoose.model("user",userSchema)


module.exports = userModel