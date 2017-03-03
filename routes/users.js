const express     = require('express');
const router      = express.Router();
const passport    = require('passport');
const bcrypt      = require('bcryptjs');
const jwt         = require('jsonwebtoken');
const config      = require('../config/database');
const User        = require('../models/user');

// Register a new user
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  });

  //password will be Encrypted pre save 
  newUser.save((err,user)=>{
    if(err)res.json({success: false, msg:'Failed to register user'});
    else{
      res.json({success: true, msg:'User registered'});
    }
  });
});

// Authenticate user
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({username:username},function(err,doc){
    if(err) throw err;
    //check the username in the database
    if(!doc){
      return res.json({success: false, msg: 'User not found'});
    }
    //check if the password match
    doc.checkPassword(password,function(err,isMatch){
      if(err) res.json({success:false,msg: 'Error while checking password'});
      if(!isMatch){
        res.json({success:false,msg: 'password does not match'});
      }
      else{
        const token = jwt.sign(doc,config.secret,{
          expiresIn:604800 // 1 week
        });

        res.json({
          success:true,
          token: 'JWT ' +token,
          user:{
              username:doc.username,
              password:doc.password,
              email:doc.email
          }
        });
      }
    })
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

module.exports = router;
