var natural = require("natural");
var parseWord = function(word) {
    word = word.toLowerCase();
    return natural.PorterStemmer.stem(word);
}
var guess = function(string, tags) {
    string = string.replace(/[^A-Za-z\.'"-]/g, " ");
    tags = tags.filter(function(tag) {
        return /[A-Za-z\.'"-]/g.test(tag);
    });
    tags = tags.map(parseWord);
    var tokenizer = new natural.WordTokenizer(),
        words = tokenizer.tokenize(string).map(parseWord);
    return tags.filter(function(tag) {
        return words.indexOf(tag) > -1;
    });
}
module.exports = guess;
