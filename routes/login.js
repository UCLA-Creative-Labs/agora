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
jwtOptions.secretOrKey = 'tasmanianDevil';

const strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
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

/*
const login = req.body
	const params = [ login.username ]
	const admin = await db.query('SElECT * FROM admins WHERE username=$1', params)
	let payload = {}

	if(!admin.rowCount){
		payload.err = 'Admin not found.'
		res.status(404).send(payload)
	}

	const rows = admin.rows
	const hash = rows[0].password
	await bcrypt.compare(login.password, hash, function(err, resp) {
	  if(resp) {	
	  	payload.admin = rows[0]
	  	res.status(200).send(payload)
	  } else {
	   	payload.err = 'Password doesn\'t match.'
	   	res.status(404).send(payload)
	  } 
	});
*/

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
  console.log(user);
  if(user.password === req.body.password) {
    // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
    var payload = {id: user.id};
    var token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({message: "ok", token: token});
  } else {
    res.status(401).json({message:"passwords did not match"});
  }
});

router.get('/secret', passport.authenticate('jwt', { session: false }), async (req, res) => {
  res.json("Success! You can not see this without a token");
});

passport.use(strategy);

module.exports = router;