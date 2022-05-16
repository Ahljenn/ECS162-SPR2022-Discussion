'use strict'

// A static server using Node and Express
const express = require("express");
const { validationResult, body } = require('express-validator');
// Import node implementation of fetch API
const fetch = require("node-fetch");

// Promises-wrapped version of sqlite3
const db = require('./sqlWrap');
// our database operations
const dbo = require('./databaseOps');

// CSRF protection
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true })

// Login modules
const passport = require('passport');
const cookieSession = require('cookie-session');
const GoogleStrategy = require('passport-google-oauth20');

// Google login credentials, used when the user contacts
// Google, to tell them where he is trying to login to, and show
// that this domain is registered for this service. 
// Google will respond with a key we can use to retrieve profile
// information, packed into a redirect response that redirects to
// server162.site:[port]/auth/redirect
const hiddenClientID = process.env['Client ID']
console.log("Client ID: "+hiddenClientID);
const hiddenClientSecret = process.env['Client Secret']
console.log("Client Secret: "+hiddenClientSecret);

// An object giving Passport the data Google wants for login.  This is the server's "note" to Google.
const googleLoginData = {
    clientID: hiddenClientID,
    clientSecret: hiddenClientSecret,
    callbackURL: '/auth/accepted',
    proxy: true
};

// Tell passport we will be using login with Google, and
// give it our data for registering us with Google.
// The gotProfile callback is for the server's HTTPS request
// to Google for the user's profile information.
// It will get used much later in the pipeline. 
passport.use(new GoogleStrategy(googleLoginData, gotProfile));

const app = express();

// pipeline stage that just echos url, for debugging
app.use('/', printURL);

// Check validity of cookies at the beginning of pipeline
// Will get cookies out of request object, decrypt and check if 
// session is still going on. 
app.use(cookieSession({
    maxAge: 6 * 60 * 60 * 1000, // Six hours in milliseconds
    // after this user is logged out.
    // meaningless random string used by encryption
    keys: ['hanger waldo mercy dance']  
}));

// Initializes passport by adding data to the request object
app.use(passport.initialize()); 

// If there is a valid cookie, this stage will ultimately call deserializeUser(),
// which we can use to check for a profile in the database
app.use(passport.session());

// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser());

// make all the files in 'static' available on the Web
app.use(express.static("static"));

// a module to use instead of older body-parser; not needed yet, but very useful!
app.use(express.json());

// Public static files - /public should just contain the login page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/splash.html");
});

app.get('/*',express.static('public'));

// next, handler for url that starts login with Google.
// The app (in public/login.html) redirects to here 
// (it's a new page, not an AJAX request!)
// Kicks off login process by telling Browser to redirect to
// Google. The object { scope: ['profile'] } says to ask Google
// for their user profile information.
app.get('/auth/google',
	passport.authenticate('google',{ scope: ['profile'] }) );
// passport.authenticate sends off the 302 (redirect) response
// with fancy redirect URL containing request for profile, and
// client ID string to identify this app. 
// The redirect response goes to the browser, as usual, but the browser sends it to Google.  
// Google puts up the login page! 

// Google redirects here after user successfully logs in
// This route has three middleware functions. It runs them one after another.
app.get('/auth/accepted',
	// for educational purposes
	function (req, res, next) {
	    console.log("at auth/accepted");
	    next();
	},
	// This will issue Server's own HTTPS request to Google
	// to access the user's profile information with the 
	// temporary key we got in the request. 
	passport.authenticate('google'),
	// then it will run the "gotProfile" callback function,
	// set up the cookie, call serialize, whose "done" 
	// will come back here to send back the response
	// ...with a cookie in it for the Browser! 
	function (req, res) {
	    console.log('Logged in and using cookies!')
      // tell browser to get the hidden main page of the app
        res.redirect('/index.html');
	});

// static files in /user are only available after login
app.get('/*',
	isAuthenticated, // only pass on to following function if
	// user is logged in 
	// serving files that start with /user from here gets them from ./
	express.static('user') 
       );

// csrf token generation
app.get("/csrf", isAuthenticated, csrfProtection, (req ,res) => {
  let token = req.csrfToken();
  console.log(`got a token: ${token}`);
  res.json(token);
});

app.get("/user", isAuthenticated, async (req, res) => {
  let user = await dbo.get_user(req.user);
  console.log(user);
  res.send({user: user.fname});
});

app.post("/characters/guess", isAuthenticated, [
  body('name').exists().trim().isAlphanumeric()
],
  async function(request, response) {
    // Check validation
    if (validationResult(request).errors.length != 0) {
      response.status(500).end();
      return;
    }

    let name = request.body.name;
    console.log(`Got a guess: ${name}`);
    let result = await dbo.get_char(name);
    if (result != null) {
      if (result.guessed === 1) {
        response.status(200).end();
      } else {
        await dbo.update_char(name);
        let updated_result = await dbo.get_char(name);
        console.log(updated_result);
        response.status(200).end();
      }
    } else {
      console.log('Character not found.');
    }
  })

app.post("/characters/add", isAuthenticated, [
  body('name').exists().trim().isAlphanumeric()
],
  async function(request, response) {
    // Check validation
    if (validationResult(request).errors.length != 0) {
      response.status(500).end();
      return;
    }

    let name = request.body.name;
    console.log(`Adding character ${name}`);
    await dbo.post_char(name).then(() => {
      response.status(200).end();
    });
  })

app.get("/characters/reset", isAuthenticated, async function (request, response) {
  console.log('Resetting character DB');
  await dbo.delete_all();
  let results = await dbo.get_all();
  console.log(results);
  response.send(results);
})

// Handle AirNow API requests
app.get("/weather/:zip", isAuthenticated, async (request, response) => {
  let zip = request.params.zip;
  // Construct the API url we are going to fetch
  let api_url = `https://www.airnowapi.org/aq/forecast/zipCode/?format=application/json&zipCode=${zip}&date=2021-04-29&distance=25&API_KEY=${process.env['API_KEY']}`;
  
  console.log("received request at /weather");

  // Handle request to the AirNow API server
  let fetch_response = await fetch(api_url);
  let json = await fetch_response.json();

  // Send the JSON object retrieved from the fetch back to the browser
  response.json(json);
})

// Comment one of the below post functions out.
// Protected POST function that takes sensitive data and does something with it
app.post('/plans', isAuthenticated, csrfProtection, function (req, res) {
  console.log('I see you carry the right token.');
  console.log(`The current plan: ${req.body.plans}`);
  res.send('Plans have been transmitted.');
})

// // Unprotected POST function
// app.post('/plans', function (req, res) {
//   console.log('I care not for tokens.');
//   console.log(`The current plan: ${req.body.plans}`);
//   res.send('Plans have been transmitted.');
// })

// finally, file not found, if we cannot handle otherwise.
app.use( fileNotFound );

// listen for requests :)
const listener = app.listen(3000, () => {
  console.log("The static server is listening on port " + listener.address().port);
});

// call the async test function for the database
// this fills the db with test data
// in your system, you can delete this. 
// dbo.testDB().catch(
//   function (error) {
//     console.log("error:",error);}
// );

// middleware functions called by some of the functions above. 

// print the url of incoming HTTP request
function printURL (req, res, next) {
    console.log(req.url);
    next();
}

// function for end of server pipeline
function fileNotFound(req, res) {
    let url = req.url;
    res.type('text/plain');
    res.status(404);
    res.send('Cannot find '+url);
    }


// function to check whether user is logged when trying to access
// personal data
function isAuthenticated(req, res, next) {
  console.log("USER CHECK: ",req.user)
    if (req.user) {
      // user field is filled in in request object
      // so user must be logged in! 
	    console.log("user",req.user,"is logged in");
	    next();
    } else {
	    console.log("user",req.user,"is not logged in");
    	res.redirect('/splash.html');  // send response telling
	// Browser to go to login page
    }
}

// Some functions Passport calls, that we can use to specialize.
// This is where we get to write our own code, not just boilerplate. 
// The callback "done" at the end of each one resumes Passport's
// internal process.  It is kind of like "next" for Express. 

// function called during login, the second time passport.authenticate
// is called (in /auth/redirect/),
// once we actually have the profile data from Google. 
async function gotProfile(accessToken, refreshToken, profile, done) {
    console.log("\n\n\nGoogle profile has arrived",profile);
    // here is a good place to check if user is in DB,
    // and to store him in DB if not already there. 
    // Second arg to "done" will be passed into serializeUser,
    // should be key to get user out of database.
    await dbo.store_and_get_user({
      userid: profile.id,
      fname: profile.name.givenName
    })

    let userid = profile.id;  

    done(null, userid); 
}

// Part of Server's session set-up.  
// The second operand of "done" becomes the input to deserializeUser
// on every subsequent HTTP request with this session's cookie. 
passport.serializeUser((userid, done) => {
    console.log("SerializeUser. Input is",userid);
    done(null, userid);
});

// Called by passport.session pipeline stage on every HTTP request with
// a current session cookie. 
// Where we should lookup user database info. 
// Whatever we pass in the "done" callback becomes req.user
// and can be used by subsequent middleware.
passport.deserializeUser(async (userid, done) => {
    console.log("deserializeUser. Input is:", userid);
    // here is a good place to look up user data in database using
    // dbRowID. Put whatever you want into an object. It ends up
    // as the property "user" of the "req" object. 
    let userData = await dbo.get_user({userid: userid});
    // userData = (userData === undefined) ? {userid: 'none'} : userData
    console.log("userData====", userData)
    done(null, userid);
});
