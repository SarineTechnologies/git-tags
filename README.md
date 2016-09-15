# git-tags
>Create and upload git tags

![alt tag](git-tag.gif)

## Getting Started
This repo will help you to get your existing `git tags`, copy them, rename them and push the new ones back to GitHub.

It can be used for CI/CD systems that uploads version into relevant environment based on the `git tag` name.

## Settings
* change the settings.json `org` to your organisation Git name
* change the settings.json `apps` array to include all relevant apps you want to use
* for each `app`:
  * set display name (`name`)
  * set the repository name (`repo`)
  * set the environments names you want to use(`envs`) 

## Running
* `npm install`
* `npm run`
* answer the prompt questions

## Result
This tool will upload copy of the selected `git tag` into your GitHub account with new name based on this pattern: 
```js
{{ env }}-{{ git-tag-name }}
```
* set your CI/CD to run automated build whenever a new `git tag` is created
* set your CI/CD to upload a new version of this `git-tag-name` into the relevant `env`

  
  
