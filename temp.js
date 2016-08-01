'use strict';

// let github = require('./github.js');


// github.getTag('sarine.viewer.templates.widget', 'v1.11.0').then((tag) => {
//     console.log('tag.sha: ' + tag[0].commit.sha);
// });

var GitHubApi = require("github");

//create API
var github = new GitHubApi({});

//auth
github.authenticate({ type: "basic", username: process.env.USERNAME, password: process.env.PASSWORD });

//create tag
const promise = github.gitdata.createTag({
    user: "adica",
    repo: "sarine.viewer.templates.widget",
    "tag": "temp",
    "message": "this is temp tag",
    "object": "9452a7c65dea101627823c1631d692216efe99b1",
    "type": "commit",
    "tagger": { name: "adica", email: "adic@tikalk.com", date: new Date() }

});

promise.then((newTag) => {
    github.gitdata.createReference({
        user: "adica",
        repo: "sarine.viewer.templates.widget",
        ref: "refs/tags/temp",
        sha: newTag.sha
    }).then((resp) => {
        console.log('done')
    });

});

promise.catch((reason)=>{
	console.log('Error: '+ reason)
});
