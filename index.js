var guessTagsEn = require("./lib/guess-tags-en"),
    guessTagsCn = require("./lib/guess-tags-cn");

module.exports = function(app) {
    app.when(function *() {

        return (typeof this.files !== "undefined" && this.files.some(function(file) {
            return (typeof file.content !== "undefined");
        }));

    }).use(function *(next) {

        var globalTags = this.config.tags,
            ctx = this;
        this.files = this.files.map(function(file) {
            if(typeof file.content !== "undefined" && file.status === "modified") {
                var str = [file.content, file.path, file.title].join(' ');
                if(!file.tags) {
                    file.tags = [];
                }
                file.tags = file.tags.concat(guessTagsEn(str, globalTags));
                file.tags = file.tags.concat(guessTagsCn(str, globalTags));
                ctx.logger.info(file.title + ': ' + JSON.stringify(file.tags));
            }
            return file;
        });

        yield next;
    });
};
