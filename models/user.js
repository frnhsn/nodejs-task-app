const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');

// Loading environment varialbles
dotenv.config();
const secretKey = process.env.TOKEN_SECRET;

mongoose.connect("mongodb://127.0.0.1/",{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})

// Schema definition
var userSchema = mongoose.Schema({
    fullname: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
        index: {unique: true},
    },
    email: {
        type: String,
        require: true,
        validate: {
            validator: function(value) {
                return validator.isEmail(value);
            },
            message: function(props) {
                return 'Email is invalid';
            },
        },
    },
    password: {
        type: String,
        require: true,
    },
    sesions: {
        token: String,
        expired_at: Date,
    }
})

// Schema pre middleware to crypt the password
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next()
})

// Schema methods middleware 
userSchema.statics.findByCredentials = async function(email, password) {
    try {
        let user = await mongoose.model('User').findOne({email: email});
        if (!user) {return new Error("User not found");}
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {return new Error("Unable to login");}
        return user;
    } catch (err) {
        return new Error(err);
    }
};

userSchema.statics.generateAuthToken = async function(payload) {    
    let token = await jwt.sign({username: payload}, secretKey, {expiresIn: '1h'})
    let exp = new Date(jwt.decode(token).exp*1000)
    
    return {
        token: token,
        expiredAt: exp,
    }
}

userSchema.statics.login = async function(email, password) {
    try {
        let user = await userModel.findOne({email: email});
        if (!user) {return new Error("User not found");}
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {return new Error("Unable to login");}    
        
        let {token, expiredAt} = await userModel.generateAuthToken(user.username);

        console.log(user._id);
        
        await userModel.findByIdAndUpdate({_id: user._id,},
            {
                sesions: {
                    token: token,
                    expired_at: expiredAt,
            },
        })

        return {message: `${user.username} has successfully logged in.`}

    } catch (err) {
        return new Error(err);
    }
};

// Model definition
var userModel = mongoose.model('User', userSchema);

// userModel.login('heru@internet.com', 'herucute').then(res => {
//     console.log(res);
// }).catch(err => {
//     console.log(err);
// })

// userModel.findByCredentials('heru@internet.com','hersucute').then(
//     res => {console.log(res);}
// ).catch(err => {console.log(err);})

// mongoose.model('User').findOne({
//     email: 'heru@internet.com',
// }, (err, user) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(user);
// })

// user = userModel({
//     fullname: 'Heru Ajah',
//     username: 'herucute',
//     email: 'heru@internet.com',
//     password: 'herucute',
// });

// user.save().then((result) => {
//     console.log(result);
// }).catch((err) => {
//     console.log(err);
// });

module.exports = {
    userModel,
}