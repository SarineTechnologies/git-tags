'use strict';

let inquirer = require('inquirer'),
    github = require('./github.js'),
    gitConfig = require('git-config'),
    config = gitConfig.sync(),
    apps = require('./settings.json').apps,
    credPrompt,
    applicationsPrompt,
    tagsPrompt,
    envsPrompt,
    approvePrompt,
    selected;

credPrompt = [{
    type: 'input',
    message: 'Enter your git user',
    name: 'user',
    default: config.user.name
}, {
    type: 'password',
    message: 'Enter your git password',
    name: 'password',
    default: config.user.password
}];

applicationsPrompt = {
    type: 'list',
    name: 'application',
    message: 'Please choose application:',
    choices: apps.map((a) => {
        return a.name;
    })
};

tagsPrompt = {
    type: 'list',
    name: 'tag',
    message: 'Please choose tag:',
    choices: []
};


approvePrompt = [{
    type: 'input',
    name: 'approve',
    message: 'Are you sure you want to upload {{tag}} of {{app}} into {{env}} (y/n)?',
    validate: function(value) {
        var pass = value.match(/y|n/i);
        if (pass) return true;
        return 'Please enter "y" or "n"';
    }
}];

envsPrompt = {
    type: 'list',
    name: 'env',
    message: 'Please choose environment:',
    choices: []
};

selected = {
    app: '',
    tag: '',
    env: ''
}

function setCreds() {
    inquirer.prompt(credPrompt).then((answers) => {
        process.env.USERNAME = answers.user;
        process.env.PASSWORD = answers.password;
        chooseApp();
    });


}

function chooseApp() {
    inquirer.prompt(applicationsPrompt).then((answers) => {
        selected.app = answers.application;
        var selectedApp = apps.filter((a) => {
            return a.name === selected.app;
        })[0];
        envsPrompt.choices = selectedApp.envs;

        github.getTagsByApp(selectedApp.repo).then((arr) => {
            tagsPrompt.choices = arr;

            chooseTag();
        });
    });
}

function chooseTag() {
    inquirer.prompt(tagsPrompt).then((answers) => {
        selected.tag = answers.tag;
        chooseEnv();
    });
}

function chooseEnv() {
    inquirer.prompt(envsPrompt).then((answers) => {
        selected.env = answers.env;
        approvePrompt[0].message = approvePrompt[0].message
            .replace('{{tag}}', selected.tag)
            .replace('{{app}}', selected.app)
            .replace('{{env}}', selected.env);
        approve();
    });
}

function approve() {
    inquirer.prompt(approvePrompt).then((answers) => {
        if(answers.approve){
            console.log('do it youreslf!!')
        }
    });
}

setCreds();
