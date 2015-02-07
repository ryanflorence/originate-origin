var glob = require('glob');
var color = require('cli-color');
var red = color.red;

exports.before = function(next, env) {
  env.appName = env.args[0];
  if (!env.appName.match(/^originate-/)) {
    console.log(red('\nname invalid "'+env.appName+'"; origins must be named "originate-<name>"\n'));
    process.exit();
  }
  next();
};

exports.present = function(next, env) {
  next({
    appName: env.appName,
    originName: env.appName.replace(/^originate-/, ''),
    headerChars: env.appName.split('').map(function() { return '='; }).join('')
  })
};

exports.savePath = function(next, env, template) {
  if (template == 'loom/generators/origin.js.hbs') {
    template = 'loom/generators/'+env.appName.replace(/^originate-/, '')+'.js.hbs';
  }
  next(env.appName+'/'+template.replace('.hbs', ''));
};

exports.templates = glob.sync(__dirname+'/../templates/**/*.hbs', {dot: true}).map(function(template) {
  var base = __dirname.replace(/generators$/, '')+'templates/';
  return template.replace(base, '');
});

