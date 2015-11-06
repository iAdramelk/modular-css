var assert = require("assert"),
    plugin = require("../src/plugins/scoping");

function css(src, options) {
    return plugin.process(src, options).css;
}

describe("postcss-modular-css", function() {
    describe("scoping", function() {
        it("should generate a prefix for class names", function() {
            assert.equal(
                css(".wooga { color: red; }"),
                ".83fe1a59eebdf17220df583a8e9048da_wooga { color: red; }"
            );
        });
        
        it("should generate a prefix for ids", function() {
            assert.equal(
                css("#wooga { color: red; }"),
                "#5dde9181034d498d7163570eea1e3987_wooga { color: red; }"
            );
        });
        
        it("should ignore non-class/non-id selectors", function() {
            assert.equal(
                css("p { color: red; }"),
                "p { color: red; }"
            );
        });

        it("should only transform class/id selectors", function() {
            assert.equal(
                css(".wooga p { color: red; }"),
                ".7b944dc32d3d3f9ee2567de2101b5988_wooga p { color: red; }"
            );

            assert.equal(
                css("#wooga p { color: red; }"),
                "#b350f25893cfee96ec24f2e48e73349e_wooga p { color: red; }"
            );
            
            assert.equal(
                css("#wooga .booga { color: red; }"),
                "#bf6193cc71ecb94fb202e8fea1df388a_wooga .bf6193cc71ecb94fb202e8fea1df388a_booga { color: red; }"
            );

            assert.equal(
                css("#wooga { color: red; } #wooga:hover { color: blue; }"),
                "#134c0871e7c8220eca018a7499dc4bc4_wooga { color: red; } #134c0871e7c8220eca018a7499dc4bc4_wooga:hover { color: blue; }"
            );

            assert.equal(
                css(".wooga { color: red; } .wooga:hover { color: black; }"),
                ".b788f7606cd25b7137bda6ab728d76a7_wooga { color: red; } .b788f7606cd25b7137bda6ab728d76a7_wooga:hover { color: black; }"
            );
        });
        
        it("should transform selectors within media queries", function() {
            assert.equal(
                css("@media (max-width: 100px) { .booga { color: red; } }"),
                "@media (max-width: 100px) { .1c058ba8c40ce27eb8eef0ed1d5ef09a_booga { color: red; } }"
            );
        });
        
        it("should use a supplied string prefix for class names", function() {
            assert.equal(
                css(".wooga { color: red; }", { prefix : "tooga" }),
                ".tooga_wooga { color: red; }"
            );
        });
        
        it("should call a naming function for class names", function() {
            assert.equal(
                css(".wooga { color: red; }", {
                    namer : function(selector) {
                        return "googa_" + selector;
                    }
                }),
                ".googa_wooga { color: red; }"
            );
        });
        
        it("should expose original classname in a message", function() {
            var result = plugin.process(".wooga { color: red; }");
            
            assert.deepEqual(result.messages, [ {
                type    : "modularcss",
                plugin  : "postcss-modular-css-scoping",
                classes : {
                    wooga : "83fe1a59eebdf17220df583a8e9048da_wooga"
                }
            } ]);
        });

        describe(":global()", function() {
            it("should remove :global() from non-class/non-id selectors", function() {
                assert.equal(
                    css(":global(p) { color: red; }"),
                    "p { color: red; }"
                );
            });

            it("should throw if :global is used without a child selector", function() {
                assert.throws(function() {
                    css(":global p { color: red; }");
                }, /:global\(\.\.\.\) requires a child selector/);

                assert.throws(function() {
                    css(":global() p { color: red; }");
                }, /:global\(\.\.\.\) requires a child selector/);
            });

            it("shouldn't transform global selectors", function() {
                assert.equal(
                    css(":global(.wooga) { color: red; }"),
                    ".wooga { color: red; }"
                );
                
                assert.equal(
                    css(":global(#wooga) { color: red; }"),
                    "#wooga { color: red; }"
                );
                
                assert.equal(
                    css("@media (max-width: 100px) { :global(.booga) { color: red; } }"),
                    "@media (max-width: 100px) { .booga { color: red; } }"
                );
            });
            
            it("should support mixed local & global selectors", function() {
                assert.equal(
                    css(":global(#wooga), .wooga { color: red; }"),
                    "#wooga, .0161606ae727b8d0466e905957eca53c_wooga { color: red; }"
                );
            });

            it("should support multiple selectors", function() {
                assert.equal(
                    css(":global(.wooga .booga) { color: red; }"),
                    ".wooga .booga { color: red; }"
                );
            });

            it("should include :global(...) identifiers in a message", function() {
                var result = plugin.process(
                        ":global(.wooga) { color: red; } :global(#fooga) { color: red; } :global(.googa .tooga) { color: red; }"
                    );
                
                assert.deepEqual(result.messages, [ {
                    type    : "modularcss",
                    plugin  : "postcss-modular-css-scoping",
                    classes : {
                        fooga : "fooga",
                        googa : "googa",
                        tooga : "tooga",
                        wooga : "wooga"
                    }
                } ]);
            });
        });
    });
});
