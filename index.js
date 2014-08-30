var _ = require("underscore"),
    guessTagsEn = require("./lib/guess-tags-en"),
    guessTagsCn = require("./lib/guess-tags-cn");;

module.exports = function(app) {
    app.when(function *() {

        var isContentDefined = function(files) {
            return files && _.find(files, function(file) {
                return (typeof file.content !== "undefined");
            });
        };
        return isContentDefined(this.newFiles) || isContentDefined(this.changedFiles);

    }).use(function *(next) {

        var globalTags = this.config.tags,
            ctx = this;
        var guessTags = function(file) {
            if(file.content) {
                var str = file.content + " " + file.path;
                if(!file.tags) {
                    file.tags = [];
                }
                file.tags = file.tags.concat(guessTagsEn(str, globalTags));
                file.tags = file.tags.concat(guessTagsCn(str, globalTags));
                ctx.logger.info(file.title + ': ' + JSON.stringify(file.tags));
            }
            return file;
        };

        this.changedFiles = this.changedFiles.map(guessTags);
        this.newFiles = this.newFiles.map(guessTags);

        yield next;
    });
};
