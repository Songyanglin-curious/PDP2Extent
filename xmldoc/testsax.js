var sax = require("sax");
var strict = true, // set to false for html-mode
    parser = sax.parser(strict);

parser.onerror = function (e) {

    // an error happened.
};
parser.ontext = function (t) {
    // got some text.  t is the string of text.
};
parser.onopentag = function (node) {
    // console.log(node);
    // opened a tag.  node has "name" and "attributes"
};
parser.onclosetag = function (node) {
    console.log(node);
    // opened a tag.  node has "name" and "attributes"
};
parser.onattribute = function (attr) {
    // an attribute.  attr has "name" and "value"
};
parser.onend = function () {
    // parser stream is done, and ready to have more stuff written to it.
};

parser.write('<xml>Hello, <who name="world">world</who>!</xml>').close();