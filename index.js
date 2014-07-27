var _ = require("underscore"),
    guessTagsEn = require("./lib/guess-tags-en"),
    guessTagsCn = require("./lib/guess-tags-cn");;

module.exports = function(app) {
    app.when(function *() {
        return _.find(this.changedFiles, function(file) {
            return (typeof file.content !== "undefined");
        });
    }).use(function *(next) {

        this.logger.debug("kizz-guess-tags: init");

        var globalTags = this.config.tags;
        this.changedFiles = this.changedFiles.map(function(file) {
            if(file.content) {
                var str = file.content + " " + file.path;
                if(!file.tags) {
                    file.tags = [];
                }
                file.tags = file.tags.concat(guessTagsEn(str, globalTags));
                file.tags = file.tags.concat(guessTagsCn(str, globalTags));
            }
            return file;
        });

        yield next;
    });
}
