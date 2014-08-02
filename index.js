//eslint
/*
  global
    require, module, Buffer
*/

var es = require("event-stream")
  , gutil = require("gulp-util")
  , extend = require("lodash.assign");


function handleText(text, data) {
  return es.map(function(file, cb) {
    file.contents = Buffer.concat([
      new Buffer(gutil.template(text, extend({"file": file}, data)))
      , file.contents
    ]);
    cb(null, file);
  });
}

function handleFunction(f, data) {
  return es.map(function(file, cb) {
    file.contents = Buffer.concat([
      new Buffer(gutil.template(f(file, data), extend({"file": file}, data)))
      , file.contents
    ]);
    cb(null, file);
  });
}

var headerPlugin = function(header, data) {
  header = header || "";

  var headerType = typeof header;
  if ("string" == headerType) {
    return handleText(header, data);
  }
  if ("function" == headerType) {
    return handleFunction(header, data);
  }
};

module.exports = headerPlugin;
