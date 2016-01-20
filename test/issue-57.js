"use strict";

var assert = require("assert"),

    Processor = require("../src/processor");

describe("modular-css", function() {
    describe("issue 57", function() {
        it.only("should process a string", function(done) {
            var processor = new Processor();
            
            processor.file("./test/specimens/issues/57/1.css").then(function(result) {
                console.log(result);

                done();
            })
            .catch(done);
        });
    });
});
