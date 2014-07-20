var XRegExp = require("xregexp");

module.exports = function(string, tags) {
    return tags.filter(function(tag) {
        return XRegExp('^\\p{Script=Han}+$').test(tag);
    }).filter(function(tag) {
        return (string.indexOf(tag) > -1);
    });
}
