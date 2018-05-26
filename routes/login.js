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

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'gigantic_cock'; //USE ENV VAR FOR DEPLOYMENT (or separate file)

const strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  console.log('payload received', jwt_payload);

  const adminQuery = await db.query('SElECT * FROM admins WHERE id=$1', [jwt_payload.id]);

	if(!adminQuery.rowCount){
		next(null, false);
	}

  if (adminQuery.rows[0]) {
    next(null, adminQuery.rows[0]);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

router.post('/', async (req, res) => {

  if(req.body.username && req.body.password){
    var username = req.body.username;
    var password = req.body.password;
  }

  const admin_query = await db.query('SElECT * FROM admins WHERE username=$1', [username])
  if( ! admin_query.rowCount ){
    res.status(401).json({message:"no such user found"});
  }

  const admin = admin_query.rows[0];

	await bcrypt.compare(password, admin.password, function(err, resp) {
	  if(resp) {	
      const payload = {id: admin.id};
      const token = jwt.sign(payload, jwtOptions.secretOrKey);
	  	res.status(200).json({message: "ok", token: token});
	  } else {
      res.status(401).json({message:"passwords do not match"});
    } 
	});
});

//example endpoint that needs authentication/authorization
router.get('/secret', passport.authenticate('jwt', { session: false }), async (req, res) => {
  res.json("Success! You can not see this without a token");
});

module.exports = router;
