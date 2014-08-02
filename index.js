//eslint
/*
  global
    require, module, Buffer
*/

var es = require("event-stream")
  , gutil = require("gulp-util")
  , extend = require("lodash.assign");

function inject(injection, data) {
  var dynamic = "function" == typeof injection
    , injected = injection;
  return es.map(function(file, cb) {
    dynamic && (injected = injection(file, data));
    file.contents = Buffer.concat([
      new Buffer(gutil.template(injected, extend({"file": file}, data)))
      , file.contents
    ]);
    cb(null, file);
  });
}

var headerPlugin = function(header, data) {
  return inject(header || "", data);
};

module.exports = headerPlugin;
