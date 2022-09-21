const mongoose = require('mongoose')

var otpSchema=new mongoose.Schema({
    email:String,
    code:String,
    expireIn:Number
},{
    timestamps:true
})

let otp = mongoose.model("otp", otpSchema,'otp');
module.exports=otp;
