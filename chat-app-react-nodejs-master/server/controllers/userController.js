const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const Token = require("../models/token");
const Otp=require("../models/otp")
const nodemailer=require('nodemailer');

const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

module.exports.login = async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user) return res.json({ msg: "Incorrect Username", status: false });
		const isPasswordValid = await bcrypt.compare(password, user.password);
		// console.log(user.password)
		// console.log(password)
		// console.log(await bcrypt.hash(password, 10))
		if (!isPasswordValid)
			return res.json({ msg: "Incorrect Password", status: false });

		let accessToken = await user.createAccessToken();
		let refreshToken = await user.createRefreshToken();
		await User.findByIdAndUpdate(user._id, { $set: { isOnline: true } });

		//  return res.status(201).json({ accessToken, refreshToken, user });
		delete user.password;
		return res.json({ status: true, user, accessToken, refreshToken });
	} catch (ex) {
		next(ex);
	}
};

exports.generateRefreshToken = async (req, res) => {
	try {
		//get refreshToken
		const { refreshToken } = req.body;
		//send error if no refreshToken is sent
		if (!refreshToken) {
			return res.status(403).json({ error: "Access denied,token missing!" });
		} else {
			//query for the token to check if it is valid:
			const tokenDoc = await Token.findOne({ token: refreshToken });
			//send error if no token found:
			if (!tokenDoc) {
				return res.status(401).json({ error: "Token expired!" });
			} else {
				//extract payload from refresh token and generate a new access token and send it
				const payload = jwt.verify(tokenDoc.token, REFRESH_TOKEN_SECRET);
				const accessToken = jwt.sign({ user: payload }, ACCESS_TOKEN_SECRET, {
					expiresIn: "10m",
				});
				return res.status(200).json({ accessToken });
			}
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error!" });
	}
};

module.exports.register = async (req, res, next) => {
	try {
		const { username, email, password } = req.body;
		const usernameCheck = await User.findOne({ username });
		if (usernameCheck)
			return res.json({ msg: "Username already used", status: false });
		const emailCheck = await User.findOne({ email });
		if (emailCheck)
			return res.json({ msg: "Email already used", status: false });
		//  const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({
			email,
			username,
			password: password,
			admin:false,
			isOnline:true,
		});
		delete user.password;
		return res.json({ status: true, user });
	} catch (ex) {
		next(ex);
	}
};

module.exports.getAllUsers = async (req, res, next) => {
	try {
		const users = await User.find({ _id: { $ne: req.params.id } }).select([
			"email",
			"username",
			"avatarImage",
			"isOnline",
			"_id",
		]);
		return res.json(users);
	} catch (ex) {
		next(ex);
	}
};

module.exports.setAvatar = async (req, res, next) => {
	try {
		const userId = req.params.id;
		const avatarImage = req.body.image;
		const userData = await User.findByIdAndUpdate(
			userId,
			{
				isAvatarImageSet: true,
				avatarImage,
			},
			{ new: true }
		);
		return res.json({
			isSet: userData.isAvatarImageSet,
			image: userData.avatarImage,
		});
	} catch (ex) {
		next(ex);
	}
};

// module.exports.logOut = (req, res, next) => {
// 	try {
// 		if (!req.params.id) return res.json({ msg: "User id is required " });
// 		onlineUsers.delete(req.params.id);
// 		return res.status(200).send();
// 	} catch (ex) {
// 		next(ex);
// 	}
// };

module.exports.logOut = async (req, res) => {
	try {
		//delete the refresh token saved in database:
		const { username,refreshToken } = req.body; //req.header("x-auth-token");
		// console.log(username);
		await Token.findOneAndDelete({ token: refreshToken });
		const user = await User.findOne({username});
		await User.findByIdAndUpdate(user._id,{ $set: { isOnline: false } });
		return res.status(200).json({ success: "User logged out!" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error!" });
	}
};

module.exports.deleteUser = async(req,res)=>{
	try{
		const {id} = req.body;
		// console.log(id)
		await User.findByIdAndDelete(id), function (err, docs) {
			if (err){
				console.log(err)
			}
			else{
				console.log("Deleted : ", docs);
			}
		}
		return res.status(200).json({success: "User Deleted"});
	}
	catch(error){
		console.error(error);
		return res.status(500).json({error: "Internal Server Error!" });
	}
}

module.exports.emailSend = async(req,res)=>{
	let data=await User.findOne({email:req.body.email});
	const response = {};
	if(data)
	{
		let otpcode=Math.floor((Math.random()*10000)+1);
		let otpData=new Otp({
			email:req.body.email,
			code:otpcode,
			expireIn:new Date().getTime() + 300*1000
		})
		let otpResponse = await otpData.save();
		response.statustext='Success'
		mailer(req.body.email,otpcode)
		response.message='Please check your email id'
		//return res.json({ msg: "Please check your email id", status: false });
	}
	else
	{
		response.statustext='error'
		response.message='Email id not exist'
	}
	res.status(200).json(response)
};

module.exports.changePassword=async (req,res)=>{
	let data = await Otp.findOne({email:req.body.email,code:req.body.otpcode});
	const response={}
	
	if(data)
	{
		let currentTime= new Date().getTime();
		let diff = data.expireIn - currentTime;
		if(diff<0){
			response.message='Token expired'
			response.statusText='error'
			await Otp.findOneAndDelete({email:req.body.email})
		}

		else if(data.code === req.body.otpcode){

			const {email}=req.body;
			const user = await User.findOne({email});
			const newpass = await bcrypt.hash(req.body.password, 10);
            await User.findByIdAndUpdate(user._id, { $set: { password: newpass } })
			response.message='Password changed successfully'
			response.statusText='Success'
			await Otp.findOneAndDelete({email:email})
		}
		else{
			response.message='Invalid Otp'
			response.statusText='error'
		}
		
	}
		else{
		response.message='Invalid Otp or email'
			response.statusText='error'
	}
	res.status(200).json(response);
	}

var mailer=(email,otp)=>{
	var nodemailer=require('nodemailer');
	var transporter=nodemailer.createTransport({
		service:'gmail',
		// port:587,
		// secure:false,
		auth:{
			user:'bootcampteam22@gmail.com',
			pass:'gvpspqlaikwllclq'
		}
	});
	var mailOptions={
		from:'bootcampteam22@gmail.com',
		to:email,
		subject:'Sending email for password reset',
		text:'You have requested to change the password. The OTP for resetting the password is '+otp
	};

	transporter.sendMail(mailOptions, function(error,ingo){
		if(error){
			console.log(error);
		}
		else{
			console.log("email sent: "+info.response);
		}
	});
}