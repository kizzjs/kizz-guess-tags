var natural = require("natural");
var parseWord = function(word) {
    word = word.toLowerCase();
    return natural.PorterStemmer.stem(word);
};
var guess = function(string, tags) {
    string = string.replace(/[^A-Za-z\.'"-]/g, " ");
    tags = tags.filter(function(tag) {
        return /[A-Za-z\.'"-]/g.test(tag);
    });
    var parsedTags = tags.map(parseWord);
    var tokenizer = new natural.WordTokenizer(),
        words = tokenizer.tokenize(string).map(parseWord);
    return tags.filter(function(tag, index) {
        return words.indexOf(parsedTags[index]) > -1;
    });
};
module.exports = guess;
