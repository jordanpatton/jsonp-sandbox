/* dependencies */
var express          = require('express');
var expressSession   = require('express-session');
var NeDBSessionStore = require('nedb-session-store')(expressSession);
var path             = require('path');
var url              = require('url');

/**
 * Randomly generates a GUID v4.
 * @returns {string} Randomly-generated GUID v4.
 */
function guidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r=Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;
    return v.toString(16);
  });
}

/* environment variables */
var CONFIG_PORT = parseInt((process.env.CONFIG_PORT || 3000), 10);
if (isNaN(CONFIG_PORT)) {
  console.log('invalid port:', CONFIG_PORT);
  process.exit(1);
}

/* express configuration */
var app = express();

/* express middleware: session */
app.use(
  expressSession({
    secret: 'SESSION_SECRET',
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000 /* 1 year */
    },
    store: new NeDBSessionStore({
      filename: path.join(__dirname, 'databases/sessions.db')
    })
  })
);

/* express middleware: headers */
app.use(function (req, res, next) {
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

/* express routing: session management */
app.get('/session', function (req, res, next) {
  if (typeof req.query.redirectUri !== 'undefined') {
    /* parse redirectUri AND parse query string */
    var parsedUri = url.parse(req.query.redirectUri, true);
    /* begin session */
    req.session.token = parsedUri.query.token = guidv4();
    /* force uri to update */
    delete parsedUri.search;
    /* redirect with re-constructed uri */
    res.redirect(302, url.format(parsedUri));
  } else {
    res.sendStatus(400);
  }
});

/* express routing: dynamic script */
app.get('/dynamic.js', function (req, res, next) {
  var callback = req.query.callback;
  if (typeof callback !== 'undefined') {
    /* build response data */
    delete req.query.callback;
    var responsePayload = {
      query: req.query,
      timestamp: Date.now(),
      token: (req.session.token ? req.session.token : 'Begin Session')
    };
    /* send response */
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.write(callback+' && '+callback+'('+JSON.stringify(responsePayload)+');');
    res.end();
  } else {
    res.sendStatus(400);
  }
});

/* express invocation */
app.listen(CONFIG_PORT, function () {
  console.log([
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'jsonp-sandbox server running',
    ' => http://localhost:' + CONFIG_PORT,
    ' => [ ctrl + c ] to quit',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
  ].join('\n'));
});
