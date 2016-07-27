'use strict';
var exports = module.exports = {};

var settings = require('./settings.json'),
    GitHubApi = require("github"),
    Promise = require('bluebird');

//create API
var github = new GitHubApi({
    debug: false,
    protocol: "https",
    host: "api.github.com",
    pathPrefix: "",
    headers: {
        "user-agent": "Git-Tag-Generator-App"
    },
    Promise: Promise,
    followRedirects: false,
    timeout: 5000
});

//auth
github.authenticate({
    type: "basic",
    username: process.env.USERNAME,
    password: process.env.PASSWORD
});

exports.getTagsByApp = (appName) => {
    return new Promise((resolve) => {
        //get all tags
        var tagsArr = [];
        github.repos.getTags({
            user: settings.org,
            repo: appName
        }).then((tags) => {
            var app = settings.apps.filter((a) => {
                return a.repo === appName;
            })[0];
            tags.forEach(function(tag) {
                //TODO
                // app.envs.forEach(function(e) {
                //     if (tag.name.indexOf(e) === -1 &&
                //         tagsArr.indexOf(tag) === -1) {
                //         console.log('e: ' + e)
                //         tagsArr.push(tag);
                //     }
                // });
                if (tag.name.indexOf('qa') === -1 &&
                    tag.name.indexOf('stg') === -1 &&
                    tag.name.indexOf('prod') === -1) {
                    tagsArr.push(tag);
                }
            });

            return resolve(tagsArr);
        });
    });


}

//create tag
/*github.gitdata.createTag({
    user: "adica",
    repo: "test",
    "tag": "1.0.1",
    "message" : "this is tag 1.0.1",
    "object" : "e49c5cd353ba336ec9d985437f9ca69e082a5706",
    "type" : "commit",
    "tagger": { name: "adica", email: "adic@tikalk.com", date: new Date()}

}).then((newTag) => {
    github.gitdata.createReference({ 
        user: "adica",
        repo: "test",
        ref : "refs/tags/1.0.1",
        sha: newTag.sha
     }).then((resp)=>{
        console.log('done')
    });
});*/

// github.repos.getAll({}).then((repos) =>{
//  //apps.forEach((app) => {
//       repos.forEach((repo) =>{
//          //if(repo.name === app)
//              console.log(repo.name);
//       })
//  //})
// });
