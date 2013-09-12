var checker   = require('npm-license');      // AceMetrix/npm-license
var thispack;
try {
	thispack  = require('../../package.json');
} catch(e) {
	thispack  = require('./package.json');
}

checker.init({
    start: './',
    suppress: true
}, function(json) {

	var green = '?bg=%23339e00';
	var yellow = '?bg=%23ddcb02';
	var colors = {
		'APACHE' : green,
		'APACHE*' : green,
		'BSD' : green,
		'BSD*' : green,
		'GPL' : green,
		'GPL*' : green,
		'MIT' : green,
		'MIT*' : green,
		'PD' : green,
		'PD*' : green,
		'UNKNOWN': yellow
	};

	var bylicense = {
		'APACHE' : {},
		'APACHE*' : {},
		'BSD' : {},
		'BSD*' : {},
		'GPL' : {},
		'GPL*' : {},
		'MIT' : {},
		'MIT*' : {},
		'PD' : {},
		'PD*' : {},
		'UNKNOWN': {}
	}

	var asterix = ' (it seems based on text scan)';

	var licenseDesc = {
		'APACHE'  : 'Apache',
		'APACHE*' : 'Apache'+asterix,
		'BSD'     : 'Berkeley Software Distribution',
		'BSD*'    : 'Berkeley Software Distribution'+asterix,
		'GPL'     : 'GNU General Public License',
		'GPL*'    : 'GNU General Public License'+asterix,
		'MIT'     : 'Massachusetts Institute of Technology',
		'MIT*'    : 'Massachusetts Institute of Technology'+asterix,
		'PD'      : 'Public Domain',
		'PD*'     : 'Public Domain'+asterix,
		'UNKNOWN' : 'Unknown License'
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
		var upper_license = license.toUpperCase();
		if (!bylicense[upper_license]) {
			bylicense[upper_license] = {};
		}
		if (typeof item.repository == 'string') {
			item.repository = item.repository.replace('git@github.com:', 'https://github.com/');
		}
		bylicense[upper_license][pack] = {
			ver: ver,
			repo: item.repository
		}
	});


	var results = ''; //"Dependencies:\n\n";
	Object.keys(bylicense).forEach(function(license) {
		var mods = bylicense[license];
//		results = results + '- ' + key + ': ';
		var first = true;
//		var any = false;
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
//					any = true;
					upper_license = license.toUpperCase();
					var color = (colors[upper_license]) ? colors[upper_license] : '';
					results = results + '[![' + key + '](http://badgr.co/'+key+'/'+ license +'.png'+color
						+ ' "'+ key + '@' + item.ver + ' ' + licenseDesc[upper_license]
						+ '")](' + item.repo + ')' + "\n";
				}
			}
		});
//		if (any) {
//			results = results + "\n";
//		}
	});

	console.log(results);

});