'use strict';

// let github = require('./github.js');


// github.getTag('sarine.viewer.templates.widget', 'v1.11.0').then((tag) => {
//     console.log('tag.sha: ' + tag[0].commit.sha);
// });

var GitHubApi = require("github");

//create API
var github = new GitHubApi({});

//auth
github.authenticate({type: "basic",username: process.env.USERNAME,password: process.env.PASSWORD});

//create tag
github.gitdata.createTag({
    user: "adica",
    repo: "test",
    "tag": "qa3-v1.0.5",
    "message" : "this is tag qa3-v1.0.5",
    "object" : "a23ed879759d3a5c0c804ebcea619ec19fede456",
    "type" : "commit",
    "tagger": { name: "adica", email: "adic@tikalk.com", date: new Date()}

}).then((newTag) => {    
    github.gitdata.createReference({ 
        user: "adica",
        repo: "test",
        ref : "refs/tags/qa3-v1.0.5",
        sha: newTag.sha
     }).then((resp)=>{
        console.log('done')
    });
    
});