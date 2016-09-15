'use strict';
var exports = module.exports = {};

var settings = require('./settings.json'),
    GitHubApi = require("github"),
    Promise = require('bluebird'),
    gitConfig = require('git-config'),
    config = gitConfig.sync();

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

exports.getTag = (appName, tagName) => {
    return new Promise((resolve, reject) => {

        exports.getTagsByApp(appName).then((tags) => {
            let selected = tags.filter((t) => {
                return t.name === tagName;
            });
            if (selected)
                return resolve(selected);
            else
                return reject("can't find tag: " + tagName + ' on: ' + appName);
        });
    });

}


exports.createTag = (repo, tagName, env, gitObjectString, user, email) => {
    return new Promise((resolve) => {
        let tagNewName = env + '-' + tagName,
            message = "tag " + tagNewName;


        //create tag
        github.gitdata.createTag({
            user: settings.org,
            repo: repo,
            "tag": tagNewName,
            "message": message,
            "object": gitObjectString,
            "type": "commit",
            "tagger": {
                name: user,
                email: email,
                date: new Date()
            }

        }).then((newTag) => {
            github.gitdata.createReference({
                user: settings.org,
                repo: repo,
                ref: "refs/tags/" + tagNewName,
                sha: newTag.sha
            }).then((resp) => {
                return resolve(resp);
            });
        });
    });

}



// github.repos.getAll({}).then((repos) =>{
//  //apps.forEach((app) => {
//       repos.forEach((repo) =>{
//          //if(repo.name === app)
//              console.log(repo.name);
//       })
//  //})
// });
