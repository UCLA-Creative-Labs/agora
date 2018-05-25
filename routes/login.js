const Router = require('express-promise-router');
const router = new Router();

const db = require('../db');

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const passport = require("passport");
const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'gigantic_cock';

const strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  console.log('payload received', jwt_payload);


  const user = users[_.findIndex(users, {id: jwt_payload.id})];
  const user2 = await db.query('SElECT * FROM admins WHERE id=$1', [jwt_payload.id]);

	if(!user2.rowCount){
		next(null, false);
	}

  console.log('USER: ', user);
  console.log('USER2: ', user2.rows[0]);

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

router.post('/', async (req, res) => {

  if(req.body.username && req.body.password){
    var username = req.body.username;
    var password = req.body.password;
  }

  const admin_query = await db.query('SElECT * FROM admins WHERE username=$1', [username])
  if( ! admin_query.rowCount ){
    res.status(401).json({message:"no such user found"});
  }

  const user = admin_query.rows[0];

  // TODO: use bcrypt to check passwords
  if(user.password === req.body.password) {
    // only identify with id from now on
    var payload = {id: user.id};
    var token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({message: "ok", token: token});
  } else {
    res.status(401).json({message:"passwords did not match"});
  }
});

//example endpoint that needs authentication/authorization
router.get('/secret', passport.authenticate('jwt', { session: false }), async (req, res) => {
  res.json("Success! You can not see this without a token");
});

passport.use(strategy);

module.exports = router;
