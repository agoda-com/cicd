![](https://github.com/pestobaimon/cicd/workflows/Nodejs/badge.svg)

# Workflows CICD Workshop

## Table of Contents
- [How to fork the repository](#how-to-fork-the-repository)
- [Creating a workflow file](#creating-a-workflow-file)
- [Triggering a workflow](#triggering-a-workflow)
- [Verifying changes before merging codes](#verifying-changes-before-merging-codes)
- [Creating pull request](#creating-pull-request)
- [Setting branch protection](#setting-branch-protection)
- [Deploying to heroku](#deploying-to-heroku)
- [Let's change some codes](#lets-change-some-codes)
- [How could we fix when some test failed?](#how-could-we-fix-when-some-test-failed)
- [More Learning Hubs](#more-learning-hubs)
- [More Agoda](#more-agoda)

## How to fork the repository
1. Click on `Fork` button (on the top-right)
2. Select your Github account

## Creating a workflow file
1. Go to `Code` tab in Github repository
2. Create a folder named `.github/workflows` inside the repository by clicking `Create new file`, paste `.github/workflows` into text box
3. Create a workflow file inside `.github/workflows`, filename can be anything but extension must be `.yml` e.g. `.github/workflows/cicd-workflow.yml`
#### Workflow file example
>```
># workflow name
>name: Nodejs
># event of the workflow
>on: push
>
>jobs:
>  build:
>    name: Nodejs
>    # specify a host machine for the job e.g. ubuntu-latest, windows-latest
>    runs-on: ubuntu-latest
>    # define environment variables using in the job
>    env:
>      IMAGE_NAME: nodejs-example
>      IMAGE_TAG: latest
>    steps:
>      # checkout codes to a build server
>      - uses: actions/checkout@v1
>
>      # build docker image
>      - name: Docker build
>        run: docker build -t $IMAGE_NAME:$IMAGE_TAG .
>
>      # run tests
>      - name: Test
>        run: docker run --rm -i $IMAGE_NAME:$IMAGE_TAG yarn test
>```
4. Click `Commit new file` button

**_NOTE:_** You can create more than one workflow in the repository.


## Triggering a workflow
Workflow will be triggered by the event defined above.  
For example,
- `push` event will be triggered when someone push some codes into the repository
- `pull_request` event will be triggered when someone open a pull request

After pushing your changes, go to `Actions` tab in your Github repository. The changes will be verified and you should see the green check in front of the workflow name when it is finished.

## Verifying changes before merging codes
1. Go back to `Code` tab
2. Go to `.github/workflows/cicd-workflow.yml`, edit the file by clicking at pencil icon
3. Change the event of the workflow from `on: push` to be `on: pull_request`  
  ```
  name: Nodejs
  on: pull_request
  ```
4. Select `Start commit` dropdown (top-right) and click `Commit changes` button
5. Go back to `Actions` tab and you should not see a new build running

## Creating pull request
1. Go to `README.md` file in root path, edit the file by clicking at pencil icon
2. Change the repository name in the first line from
```
![](https://github.com/agoda-com/cicd/workflows/Nodejs/badge.svg)
```
to be
```
![](https://github.com/<your_github_account>/cicd/workflows/Nodejs/badge.svg)
```
3. `Commit changes` by selecting `Create a new branch for this commit and start a pull request.`
4. Click `Propose file change` button
5. You will see the difference of your changes and `Create pull request`
6. Go to `Actions` tab and wait for `pull_request` workflow to be triggered
7. Go to `Pull requests` tab, you will see the check named `Nodejs (pull_request)` is running 

## Setting branch protection
Protect the master branch from having commits not tested merged by requiring status checks to pass before merging a pull request
1. Select `Settings` of your github repository
2. Go to `Branches` in the left menu and click on `Add rule` button
  - Branch name pattern: `master`
  - Check on `Require status checks to pass before merging`
  - Select `Nodejs` workflow
3. Go back to `Pull requests`, you will see `Required` badge inside the check
4. Wait for all checks to pass and click on `Merge pull request` button

## Deploying to heroku
### How to create app
1. Sign up in Heroku: https://signup.heroku.com/login
2. Verify your account in registered e-mail
3. Log in to your account
4. Select `New` (on the top-right) and then `Create new app`
5. Fill `App Name` e.g. `<your_name>-cicd`

### How to connect GitHub and Heroku together
#### In Heroku:
1. Click on your avatar on the top-right corner
2. Select `Account settings`
3. Scroll down to `API Key` and `Generate API Key...`
4. Copy `API Key`

#### In your github project repository:
5. Select `Settings` of your github repository
6. Go to `Secrets` and `Add a new secret`
    - Name: HEROKU_API_KEY
    - Value: `<your_heroku_api_key>`

### Heroku integration
1. Go back to `Code` tab and go inside `.github/workflows` directory
2. Select `Create new file`, filename can be anything but extension must be `.yml` e.g. `.github/workflows/master-cicd.yml`
```
name: Nodejs
on: 
  push:
    # the job will be triggered when there are changes in master
    branches:
      - master

jobs:
  build:
    name: Nodejs
    runs-on: ubuntu-latest
    # environment variables for Heroku
    env:
      HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
      HEROKU_APP: <your_name>-cicd
    steps:
      - uses: actions/checkout@v1

      # login to Heroku with Heroku API key
      - name: Heroku login
        uses: "actions/heroku@master"
        with: 
          args: "container:login"
          secrets: |
            $HEROKU_API_KEY

      # push codes to Heroku
      - name: Heroku push
        uses: "actions/heroku@master"
        with: 
          args: "container:push -a $HEROKU_APP web"
          secrets: |
            $HEROKU_API_KEY

      # release
      - name: Heroku release
        uses: "actions/heroku@master"
        with: 
          args: "container:release -a $HEROKU_APP web"
          secrets: |
            $HEROKU_API_KEY
```
3. Commit new file by selecting `Create a new branch for this commit and start a pull request.`
4. Name your branch to be understandable e.g. `add-master-workflow`
5. Click `Propose new file` button
6. You will see the difference of your changes and `Create pull request`
7. Wait for `pull_request` workflow to be triggered and run test
8. When everything is green, you can merge this pull request to `master`
9. `master` workflow and deployment to Heroku will be triggered following steps defined above
10. Your deployment result can be seen at [http://<your_app_name>.herokuapp.com/](http://<your_app_name>.herokuapp.com/)

**_NOTE:_** This will be triggered only when code is pushed to master branch.

## Let's change some codes
1. Go back to `Code` tab and select `server.js` file
2. Edit the file by clicking at pencil
3. Update greeting text from `Hello Everyone!!` to `Hello <your_name>!!`
4. `Commit changes` by selecting `Create a new branch for this commit and start a pull request.`
5. Name your branch to be understandable e.g. `update-greeting`
6. Click `Commit changes` button and `Create pull request`
7. Wait for `pull_request` workflow to be triggered and run test

## How could we fix when some tests failed?
1. Go back to `Code` tab
2. Select `update-greeting` branch
3. Go to `tests` directory and select `erver.test.js` file
4. Edit the file by clicking at pencil
5. Update greeting text from `Hello Everyone` to `Hello <your_name>`
6. `Commit changes` by selecting `Commit directly to the update-greeting branch.`
7. Click `Commit changes` button
8. The previous pull request is triggered
9. If everything is green, you can merge this pull request to `master`
10. Wait for `master` workflow and deployment to Heroku to be triggered
11. Your deployment result can be seen at [http://<your_app_name>.herokuapp.com/](http://<your_app_name>.herokuapp.com/)

## More Learning Hubs:
- [GitHub Actions](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/configuring-a-workflow)
- [Docker](https://docs.docker.com/)

## More Agoda:
- [Facebook Tech@Agoda](https://www.facebook.com/techatagoda/)
- [Youtube Tech@Agoda](https://www.youtube.com/channel/UCu5YSzBDy5zjTrLXE6Tmwaw)
- [Careers@Agoda](https://careersatagoda.com/)
