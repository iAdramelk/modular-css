"use strict";

var assert = require("assert"),
    
    browserify = require("browserify"),
    from       = require("from2-string"),
    
    plugin = require("../src/browserify"),
    
    bundle  = require("./lib/bundle");

describe("modular-css", function() {
    describe("issue 82", function() {
        it.only("should output postcss warnings as errors by default", function(done) {
            var build = browserify({
                    entries : from("require('./test/specimens/issues/82/index.css');")
                }),
                errors = [];
            
            build.plugin(plugin, {
                css   : "./test/output/issue-82.css",
                after : [
                    require("postcss-import")()
                ]
            });
            
            build.on("error", function(error) {
                console.log("error", error);
                
                errors.push(error);
            });
            
            build.on("bundle", console.log.bind(console, "bundle event"));
            build.on("end", console.log.bind(console, "end event"));
            
            build.bundle(function(err, out) {
                console.log("Bundle Callback", arguments); 
            });
        });
        
        it("shouldn't output postcss warnings as errors in loose mode", function(done) {
            var build = browserify({
                    entries : from("require('./test/specimens/issues/82/index.css');")
                });
            
            build.plugin(plugin, {
                css   : "./test/output/issue-82.css",
                loose : true,
                after : [
                    require("postcss-import")()
                ]
            });
            
            bundle(build, function(out) {
                    
                done();
            });
        });
    });
});
