/* dependencies */
var express = require('express');
var path    = require('path');

/* environment variables */
var CONFIG_PORT = parseInt((process.env.CONFIG_PORT || 3001), 10);
if (isNaN(CONFIG_PORT)) {
  console.log('invalid port:', CONFIG_PORT);
  process.exit(1);
}

/* express configuration */
var app = express();

/* express middleware */
app.use(function (req, res, next) {
  /* miscellaneous response headers */
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

/* express routing (static files) */
app.use(
  express.static(
    path.join(__dirname, 'public')
  )
);

/* express invocation */
app.listen(CONFIG_PORT, function () {
  console.log([
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'jsonp-sandbox client running',
    ' => http://localhost:' + CONFIG_PORT,
    ' => [ ctrl + c ] to quit',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
  ].join('\n'));
});
