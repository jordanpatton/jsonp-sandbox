/* dependencies */
var express = require('express');
var path    = require('path');

/* environment variables */
var CONFIG_PORT = parseInt((process.env.CONFIG_PORT || 3000), 10);
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

/* express routing */
app.get('/js/generated-script.js', function (req, res, next) {
  if (typeof req.query.requestId !== 'undefined') {
    var requestId = req.query.requestId;
    delete req.query.requestId;
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    res.write(
        'scriptInjector = scriptInjector || {};' +
        'scriptInjector.ingest = scriptInjector.ingest || {};' +
        'scriptInjector.ingest[\''+requestId+'\'] = '+JSON.stringify(req.query)+';'
    );
    res.end();
  } else {
    res.sendStatus(400);
  }
});

/* express static file server */
app.use(
  express.static(
    path.join(__dirname, 'public')
  )
);

/* express invocation */
app.listen(CONFIG_PORT, function () {
  console.log([
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    'script-injection-sandbox running',
    ' => http://localhost:' + CONFIG_PORT,
    ' => [ ctrl + c ] to quit',
    '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
  ].join('\n'));
});
