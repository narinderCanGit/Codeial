const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const app = express();
require('./config/view-helpers')(app);

const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
//The connect-mongo package is used to store session data in a MongoDB database instead of in memory. It's a session store for Express sessions that integrates with express-session.
const MongoStore = require('connect-mongo');
// const sassMiddleware =require('sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5001);
console.log('chat server is listening on port 5001');

const path = require('path');

// if (env.name == 'development'){
//     app.use(sassMiddleware({
//         src: path.join(__dirname, env.asset_path, 'scss'),
//         dest: path.join(__dirname, env.asset_path, 'css'),
//         debug: true,
//         outputStyle: 'extended',
//         prefix: '/css'
//     }));
// }
app.use(
  cors({
    origin: process.env.FE_URL,
    credentials: true, // Allow sending cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow these methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
  })
);

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

app.use(express.static(env.asset_path));

// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial-session',
    secret: 'blahsomething', //? change this for production mode 
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100),
        httpOnly: true, // prevents client-side JavaScript from accessing the cookie
        secure: false, // set to true if using HTTPS
        sameSite: 'lax' // helps prevent CSRF attacks
    },
    store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    dbName: 'codeial',
    collectionName: 'sessions',
    autoRemove: 'disabled'
  })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// use express router
app.use('/', require('./routes'));

//for v1 router
app.use('/v1', require('./routes/api'));

app.listen(process.env.PORT, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${process.env.PORT}`);
});
