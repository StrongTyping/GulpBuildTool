var gulp = require('gulp');

var pkgPath = process.env.PKGPATH;

if (!pkgPath) {
    pkgPath = "dist";
}

gulp.pkgPath 	= pkgPath;

var requireDir 	= require('require-dir');
var dir 		= requireDir('./_tasks');
