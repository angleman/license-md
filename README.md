# license-md [![NPM version](https://badge.fury.io/js/license-md.png?branch=master)](https://npmjs.org/package/license-md) [![Build Status](https://travis-ci.org/angleman/license-md.png?branch=master)](https://travis-ci.org/angleman/license-md) [![Dependency Status](https://gemnasium.com/angleman/license-md.png?branch=master)](https://gemnasium.com/angleman/license-md) [![License](http://badgr.co/use/MIT.png?bg=%234ed50e)](http://opensource.org/licenses/MIT)

Generate markdown npm package license badges


## Install

```
npm install license-md
```

## Usage

Append license badge markdown

```
node node_modules/license-md | sed -e 's/scanning .\///g' >> README.md
```


## License: MIT

Dependencies:

[![npm-license](http://badgr.co/bsd/npm-license.png?bg=%234ed50e)](http://github.com/AceMetrix/license-checker)