var GitHubApi = require("github");

//create API
var github = new GitHubApi({});

//auth
github.authenticate({type: "basic",username: process.env.USERNAME,password: process.env.PASSWORD});

//create tag
github.gitdata.createTag({
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
    
});