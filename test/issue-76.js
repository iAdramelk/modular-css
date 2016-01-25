"use strict";

var assert = require("assert"),
    
    Processor = require("../src/processor");

describe("modular-css", function() {
    describe("issue 76", function() {
        it("should leave hacky CSS alone", function(done) {
            var processor = new Processor();

            processor.string("./test/specimens/issues/76.css", ".aooga { color: red; *color: blue; }")
            .then(function() {
                return processor.output();
            })
            .then(function(result) {
                assert.equal(
                    result.css,
                    "/* test/specimens/issues/76.css */.mc9e096591_aooga { color: red; *color: blue; }"
                );
                
                done();
            })
            .catch(done);
        });
    });
});
