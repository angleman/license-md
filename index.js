var checker = require('npm-license')      // AceMetrix/npm-license
    thispack = require('./package.json')
;

checker.init({
    start: './'
}, function(json) {

	var colors = {
		'mit' : '?bg=%234ed50e',
		'mit*' : '?bg=%234ed50e',
		'bsd' : '?bg=%234ed50e',
		'unknown': '?bg=%23FFCE63'
	};

	var bylicense = {
		'BSD' : {},
		'MIT' : {},
		'MIT*' : {},
		'UNKNOWN': {}
	}

	Object.keys(json).forEach(function(key) {
		var item = json[key];
		var keyparts = key.split('@');
		var pack = keyparts[0];
		var ver  = keyparts[1];
		var licenses = item.licenses;
		if (typeof licenses == 'string') {
			licenses = [licenses];
		}
		var license = licenses[0];
		if (!bylicense[license]) {
			bylicense[license] = {};
		}
		bylicense[license][pack] = {
			ver: ver,
			repo: item.repository
		}
	});


	var results = "Dependencies:\n\n";
	Object.keys(bylicense).forEach(function(license) {
		var mods = bylicense[license];
//		results = results + '- ' + key + ': ';
		var first = true;
		var any = false;
		if (license == 'UNKNOWN') {
			results = results + "\n";
		}
		Object.keys(mods).forEach(function(key) {
			var item = mods[key];
			if (!thispack || !thispack.name || thispack.name != key) {
				if (!first) {
					results = results + ' ';
				};
				first=false;
				any = true;
				license = license.toLowerCase();
				var color = (colors[license]) ? colors[license] : '';
				results = results + '[![' + key + '](http://badgr.co/'+license+'/'+ key +'.png'+color+')](' + item.repo + ')';
			}
		});
		if (any) {
			results = results + "\n";
		}
	});

	console.log(results);

});