var natural = require("natural");

var parseWord = function(word) {
    word = word.toLowerCase();
    return natural.PorterStemmer.stem(word);
}

var guessTags = function(string, tags) {

    console.log(tags);

    string = string.replace(/[^A-Za-z\.'"]/g, " ");
    tags = tags.filter(/[A-Za-z\.'"]/g.test).map(parseWord);
    var tokenizer = new natural.WordTokenizer(),
        words = tokenizer.tokenize(string).map(parseWord);
    return tags.filter(function(tag) {
        return words.indexOf(tag) > -1;
    });
}

module.exports = function(app) {
    app.when(function *() {
        var file;
        for(var i = 0; i < this.changedFiles.length; i++) {
            file = this.changedFiles[i];
            if(file.content) {
                return true;
            }
        }
        return false;
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
