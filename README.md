# Niblet #

The Niblet monorepo! At this level, developers can configure cross-project files like .gitignore, .prettierrc.json, and .cspell.json. Additionally, project-specific CI/CD is carried out in the .github/ directory through GitHub actions.

### Locally run the app, website, and api concurrently ###
1. Follow each sub-directory's setup guide and verify each runs correctly.
2. Run `npm run dev`

### Synchronize Projects Using the shared/ Directory ###
* Update niblet/shared/
* ⚠️ Run `npm run sync`. Changes made in project-scoped shared directories will be overwritten.

### Editing CI/CD Pipelines ###

* Navigate to [niblet/github/workflows](https://github.com/nibletapp/niblet/tree/main/.github/workflows)
* Create a new pipeline for your project or edit and existing one. Make sure your trigger includes the following to prevent unnecessary builds:
```yml
on:
  ...
  paths:
    - 'project-directory/**' # Prevent builds when other directories are modified
 ```
