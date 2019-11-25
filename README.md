![](https://github.com/agoda-com/workflows-cicd-workshop/workflows/Nodejs/badge.svg)

# Workflows CICD Workshop

## Table of Contents
- [Creating a workflow file](#creating-a-workflow-file)
- [Triggering a workflow](#triggering-a-workflow)
- [Deploying to heroku](#deploying-to-heroku)
- [Setting branch protection](#setting-branch-protection)

## Creating a workflow file

1. Create a folder named `.github/workflows` inside the repository to store a workflow file
2. Add a workflow `.yml` file inside `.github/workflows`, file name can be any in `yml` e.g. `.github/workflows/cicd-workflow.yml`

#### Workflow file example
>```
>name: Nodejs
>on: push
>
>jobs:
>  build:
>    name: Nodejs
>    # This job runs on Linux
>    runs-on: ubuntu-latest
>    env:
>      IMAGE_NAME: nodejs-example
>      IMAGE_TAG: latest
>    steps:
>      - uses: actions/checkout@v1
>
>      - name: Docker build
>        run: docker build -t $IMAGE_NAME:$IMAGE_TAG .
>
>      - name: Test
>        run: docker run --rm -i $IMAGE_NAME:$IMAGE_TAG yarn test
>```

**_NOTE:_** You can create more than one workflow in the repository.


## Triggering a workflow
Workflow will start by the event defined above.  
For example,
- `push` event, it will be triggered when someone pushes some codes into the repository
- `pull_request` event, it will be triggered when somone open an pull request

## Deploying to heroku
### How to create app
1. Sign up in Heroku: https://signup.heroku.com/login
2. Verify your account in registered e-mail
3. Log in to your account
4. Select `New` (on the right-top) and then `Create new app`
5. Fill `App Name` e.g. `<your_name>-cicd`

### How to connect GitHub and Heroku together
1. Click on your avatar on the right-top corner
2. Select `Account settings`
3. Scroll down to `API Key` and `Generate API Key...`
4. Copy `API Key`
5. Go back to your github project repository
6. Select `Settings` of your github repository
7. Go to `Secrets` and `Add a new secret`
    - Name: HEROKU_API_KEY
    - Value: `<your_heroku_api_key>`

### Heroku integration
1. Go back to `Code` tab and go inside `.github/workflows` directory
2. Select `Create new file` and file name can be any in `yml` e.g. `.github/workflows/master-cicd.yml`
```
name: Nodejs
on: 
  push:
    branches:
      - master

jobs:
  build:
    name: Nodejs
    runs-on: ubuntu-latest
    env:
      HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
      HEROKU_APP: <your_name>-cicd
    steps:
      - uses: actions/checkout@v1

      - name: Heroku login
        uses: "actions/heroku@master"
        with: 
          args: "container:login"
          secrets: |
            $HEROKU_API_KEY

      - name: Heroku push
        uses: "actions/heroku@master"
        with: 
          args: "container:push -a $HEROKU_APP web"
          secrets: |
            $HEROKU_API_KEY

      - name: Heroku release
        uses: "actions/heroku@master"
        with: 
          args: "container:release -a $HEROKU_APP web"
          secrets: |
            $HEROKU_API_KEY
```
2. `Commit changes` by selecting `Create a new branch for this commit and start a pull request.`
3. Namimg your branch to be understandable e.g. `master-workflow`
4. Click `Propose new file` button
5. You will see difference of your changes and `Create pull request`
6. Waiting for `pull_request` workflow to be triggered and run test
7. When everything is green, you can merge this pull request to `master`
8. `master` workflow will be triggered and deploy to Heroku following steps that you define above
9. See your deployment result from [http://<your_app_name>.herokuapp.com/](http://<your_app_name>.herokuapp.com/)

**_NOTE:_** This will be triggered when pushes codes to master branch only.

### Let's change some codes
1. Go back to `Code` tab and select `server.js` file
2. Edit file by clicking at pencil
3. Update greeting text from `Hello Everyone!!` to `Hello <your_name>!!`
4. `Commit changes` by selecting `Create a new branch for this commit and start a pull request.`
5. Namimg your branch to be understandable e.g. `update-greeting`
6. Click `Commit changes` button and `Create pull request`
7. Waiting for `pull_request` workflow to be triggered and run test

### How could we fix when test failed?
1. Go back to `Code` tab
2. Firstly, select `update-greeting` branch
3. Go to `tests` directory and select `erver.test.js` file
4. Edit file by clicking at pencil
5. Update greeting text from `Hello Everyone` to `Hello <your_name>`
6. `Commit changes` by selecting `Commit directly to the update-greeting branch.`
7. Click `Commit changes` button
8. The previous pull request is triggered
9. Finally, everything is green, you can merge this pull request to `master`
10. Waiting for `master` workflow to be triggered and deployed to Heroku
11. See your deployment result from [http://<your_app_name>.herokuapp.com/](http://<your_app_name>.herokuapp.com/)

## Setting branch protection
To protect a branch from failure commits by requiring status checks before merging a pull request
1. Select `Settings` of your github repository
2. Go to `Branches` in the left menu and click on `Add rule` button
  - Branch name pattern: master
  - Check on `Require status checks to pass before merging`
  - Select `Nodejs` workflow

### More Learning Hubs:
- [GitHub Actions](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/configuring-a-workflow)
- [Docker](https://docs.docker.com/)

### More Agoda:
- [Facebook Tech@Agoda](https://www.facebook.com/techatagoda/)
- [Youtube Tech@Agoda](https://www.youtube.com/channel/UCu5YSzBDy5zjTrLXE6Tmwaw)
- [Careers@Agoda](https://careersatagoda.com/)
