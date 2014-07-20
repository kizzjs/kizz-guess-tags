var natural = require("natural"),
    _ = require("underscore");

var parseWord = function(word) {
    word = word.toLowerCase();
    return natural.PorterStemmer.stem(word);
}

var guessTags = function(string, tags) {

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

module.exports = function(app) {
    app.when(function *() {
        return _.find(this.changedFiles, function(file) {
            return (typeof file.content !== "undefined");
        });
    }).use(function *(next) {
        var globalTags = this.config.tags;
        this.changedFiles = this.changedFiles.map(function(file) {
            if(file.content) {
                var str = file.content + " " + file.path,
                    tags = guessTags(str, globalTags);
                if(!file.tags) {
                    file.tags = [];
                }
                file.tags = file.tags.concat(tags);
            }
            return file;
        });
        yield next;
    });
}
