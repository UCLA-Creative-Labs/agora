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

/* accepts requests with Header:
      Authorization: 'Bearer ' + TOKEN_HERE
*/
const strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
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

passport.use('jwt-1', strategy);

/* login route
 * req.body expected:
 * {
 *  username: string,
 *  password: string
 * }
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

/* NOTICE: delete route for production */
router.post('/bypass', async (req, res) => {
	const admin = req.body;
	let payload = {};

	const query = await db.query('SELECT * FROM admins WHERE username=$1', [admin.username]);

  if ( query.rowCount ) {
		payload.err = "Admin with that username already exists.";
		res.status(404).send(payload);
	}

	const hash = await bcrypt.hash(admin.password, 10);
	const params = [ admin.last_name, admin.first_name, admin.email, hash, admin.username ];

	const insertQuery = await db.query('INSERT INTO admins (last_name, first_name, email, password, username) VALUES ($1, $2, $3, $4, $5)', params);

  if (insertQuery.err) {
    res.status(500).send(insertQuery.err.detail);
  }

  if ( !insertQuery.rowCount ) {
		payload.err = "Admin not created.";
		res.status(500).send(payload);
	}

  res.status(201).send("Admin created");
});

// example endpoint that needs authentication/authorization
router.get('/secret', passport.authenticate('jwt-1', { session: false }), async (req, res) => {
  res.json("Success! You can not see this without a token");
});

module.exports = {
  login: router, 
  passport
};
