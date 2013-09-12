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
		'Apache' : green,
		'Apache*' : green,
		'BSD' : green,
		'BSD*' : green,
		'GPL' : green,
		'GPL*' : green,
		'MIT' : green,
		'MIT*' : green,
		'PD' : green,
		'PD*' : green,
		'Unknown': yellow
	};

	var bylicense = {
		'Apache' : {},
		'Apache*' : {},
		'BSD' : {},
		'BSD*' : {},
		'GPL' : {},
		'GPL*' : {},
		'MIT' : {},
		'MIT*' : {},
		'PD' : {},
		'PD*' : {},
		'Unknown': {}
	}

	var asterix = ' (guess based on text scan)';

	var licenseDesc = {
		'Apache'  : 'Apache',
		'Apache*' : 'Apache'+asterix,
		'BSD'     : 'Berkeley Software Distribution',
		'BSD*'    : 'Berkeley Software Distribution'+asterix,
		'GPL'     : 'GNU General Public License',
		'GPL*'    : 'GNU General Public License'+asterix,
		'MIT'     : 'Massachusetts Institute of Technology',
		'MIT*'    : 'Massachusetts Institute of Technology'+asterix,
		'PD'      : 'Public Domain',
		'PD*'     : 'Public Domain'+asterix,
		'Unknown' : 'Unknown License'
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
			license = 'Unknown';
		}
		if (license == 'UNKNOWN') {
			license = 'Unknown';
		}
		if (!bylicense[license]) {
			bylicense[license] = {};
		}
		if (typeof item.repository == 'string') {
			item.repository = item.repository.replace('git@github.com:', 'https://github.com/');
		}
		bylicense[license][pack] = {
			ver: ver,
			repo: item.repository
		}
	});


	var results = ''; //"Dependencies:\n\n";
	Object.keys(bylicense).forEach(function(license) {
		var mods = bylicense[license];
		var first = true;
		if (license == 'Unknown') {
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
					var color = (colors[license]) ? colors[license] : '';
					results = results + '[![' + key + '](http://badgr.co/'+key+'/'+ license +'.png'+color
						+ ' "'+ key + '@' + item.ver + ' ' + licenseDesc[license]
						+ '")](' + item.repo + ')' + "\n";
				}
			}
		});
	});

	console.log(results);

});