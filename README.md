![](https://github.com/Pohfy123/workflows-cicd-workshop/workflows/Nodejs/badge.svg)

# Workflows CICD Workshop

## Table of Contents
- [Creating a workflow file](#creating-a-workflow-file)
- [Triggering a workflow](#triggering-a-workflow)
- [Deploying to heroku](#deploying-to-heroku)
- [Setting branch protection](#setting-branch-protection)

## Creating a workflow file

1. Create a folder named `.github/workflows` inside the repository to store a workflow file
2. Add a workflow `.yml` file inside `.github/workflows`, file name can be any e.g. `.github/workflows/cicd-workflow.yml`

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
5. Fill `App Name` e.g. `<your_name>-cicd-workshop`

### How to integrate to the workflow
1. Click on your avatar on the right-top corner
2. Select `Account settings`
3. Scroll down to `API Key` and `Generate API Key...`
4. Copy `API Key`
5. Go back to your github project repository
6. Select `Settings` of your github repository
7. Go to `Secrets` and `Add a new secret`
    - Name: HEROKU_API_KEY
    - Value: `<your_heroku_api_key>`
8. Update a workflow file or create another file to contain last three steps
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
      HEROKU_APP: <your_name>-cicd-workshop
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

**_NOTE:_** This will be triggered when pushes codes to master branch only.

## Setting branch protection
To protect a branch from failure commits by requiring status checks before merging a pull request
1. Select `Settings` of your github repository
2. Go to `Branches` in the left menu and click on `Add rule` button
  - Branch name pattern: master
  - Check on `Require status checks to pass before merging`
  - Select `Nodejs` workflow



*** **_You can find more about github actions [here](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/configuring-a-workflow)_** ***