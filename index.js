var checker   = require('npm-license');      // AceMetrix/npm-license
var thispack;
try {
	thispack  = require('../../package.json');
} catch(e) {
	thispack  = require('./package.json');
}

checker.init({
    start: './'
}, function(json) {

	var colors = {
		'apache' : '?bg=%23339e00',
		'apache*' : '?bg=%23339e00',
		'bsd' : '?bg=%23339e00',
		'mit' : '?bg=%23339e00',
		'mit*' : '?bg=%23339e00',
		'unknown': '?bg=%23ddcb02'
	};

	var bylicense = {
		'APACHE' : {},
		'APACHE*' : {},
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
		try {
			var license = licenses[0];
		} catch(err) {
			license = 'UNKNOWN';
		}
		if (!bylicense[license]) {
			bylicense[license] = {};
		}
		bylicense[license][pack] = {
			ver: ver,
			repo: item.repository.replace('git@github.com:', 'https://github.com/')
		}
	});


	var results = ''; //"Dependencies:\n\n";
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
				if (!thispack || !thispack.dependencies || thispack.dependencies[key]) { // only include non-dev packages
					if (!first) {
						results = results + "\n";
					};
					first=false;
					any = true;
					license = license.toLowerCase();
					var color = (colors[license]) ? colors[license] : '';
					results = results + '[![' + key + '](http://badgr.co/'+license+'/'+ key +'.png'+color+' "'+ key + '@' + item.ver+'")](' + item.repo + ')';
				}
			}
		});
		if (any) {
			results = results + "\n";
		}
	});

	console.log(results);

});