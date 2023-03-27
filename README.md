# Nibl #

## Demo Video / API & Frontend Overview
[![Nibl demo video](https://img.youtube.com/vi/DVE5x8MeYDo/0.jpg)](https://www.youtube.com/watch?v=DVE5x8MeYDo)


### Locally run the app, website, and api concurrently ###
1. Follow each sub-directory's setup guide and verify each runs correctly.
2. Run `npm run dev`

### Editing CI/CD Pipelines ###

* Navigate to [niblet/github/workflows](https://github.com/nibletapp/niblet/tree/main/.github/workflows)
* Create a new pipeline for your project or edit and existing one. Make sure your trigger includes the following to prevent unnecessary builds:
```yml
on:
  ...
  paths:
    - 'project-directory/**' # Prevent builds when other directories are modified
 ```
