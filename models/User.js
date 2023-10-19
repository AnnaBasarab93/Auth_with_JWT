import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 15,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
    
},  {timestamps: true} )

const User = mongoose.model('User', UserSchema);

export default User;