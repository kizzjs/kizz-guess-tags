var XRegExp = require("xregexp").XRegExp;

module.exports = function(string, tags) {
    return tags.filter(function(tag) {
        return XRegExp('^\\p{Han}+$').test(tag);
    }).filter(function(tag) {
        return (string.indexOf(tag) > -1);
    });
}
