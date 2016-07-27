var git = require('./github.js');

'use strict';
var inquirer = require('inquirer');

var applicationsPrompt = {
    type: 'list',
    name: 'application',
    message: 'Please choose application:',
    choices: ['BASEWIDGET', 'BASEDASHBOARD', 'CONFIGURATOR', 'test']
};

var tagsPrompt = {
    type: 'list',
    name: 'tag',
    message: 'Please choose tag:',
    choices: []
};


var approvePrompt = [  
  {
    type: 'input',
    name: 'approve',
    message: 'Are you sure you want to upload {{tag}} of {{app}}?',
    validate: function (value) {
      var pass = value.match(/y|n/i);
      if (pass) {
        return true;
      }
      return 'Please enter "y" or "n"';
    }
  }
];

var selected = {
    app :'',
    tag: ''
}


function chooseApp() {
    inquirer.prompt(applicationsPrompt).then(function(answers) {
        selected.app = answers.application;
        git.getTagsByApp(answers.application).then(function(arr) {
            tagsPrompt.choices = arr;
            chooseTag();
        });
    });
}

function chooseTag() {
    inquirer.prompt(tagsPrompt).then(function(answers) {
        selected.tag = answers.tag;   
        approvePrompt[0].message = approvePrompt[0].message.replace('{{tag}}',selected.tag).replace('{{app}}',selected.app);
        approve();
    });
}

function approve () {
   inquirer.prompt(approvePrompt).then(function(answers) {

    });
}

chooseApp();
