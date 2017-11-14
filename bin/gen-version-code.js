#! /usr/bin/env node

const fs = require('fs');
const pkg_version = process.env.npm_package_version;

console.log('Writing version.ts module for version: ' + pkg_version);

fs.readFile('./src/catavolt/version.ts', 'utf8', function (err,data) {
    if (err) { return console.log(err); }
    var result = data.replace(/CATAVOLT_SDK_VERSION:string = '.*';/g, "CATAVOLT_SDK_VERSION:string = '" + pkg_version + "';");
    fs.writeFile('./src/catavolt/version.ts', result, 'utf8', function (err) {
        if (err) return console.log(err);
    });
});



