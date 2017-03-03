const mongoose   = require('mongoose');
const bcrypt     = require('bcryptjs');
const config     = require('../config/database');

const SALT_FACTOR = 10;
// User Schema
let UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

//check password
UserSchema.methods.checkPassword = function(password,done){
  bcrypt.compare(password,this.password,function(err,isMatch){
    done(err,isMatch);
  });
};

// ************ Encrypt the password if it's Modified *********************
UserSchema.pre("save",function(done){
  let user = this;
  if(!user.isModified("password")){
    return done();
  }
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if(err) throw err;
      user.password = hash;
      done();
    });
  });
});


const User = mongoose.model('User', UserSchema);

module.exports = User;
