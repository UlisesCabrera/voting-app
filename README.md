# Poll Creation and Sharing app

### Requirements
- Node.js
- NPM
- Mongodb
- Bower

### Installation

1.Install dependecies 

```sh
$ npm install
```

2.Create a .bowerrc file on the app root folder with the following info

```sh
{
    "directory" : "public/vendor"
}
```
3.Install vendor dependecies

```sh
$ bower install
```

4.Create a .env file on the app root folder with the following info

```sh
BASEURL= [main url of application]
MONGO_URI=[mongodb url]

FB_CLIENT_ID=[fb client id]
FB_CLIENT_SECRET=[fb client secret]

GITHUB_ID=[github id]
GITHUB_SECRET=[github secret]

GOOGLE_ID=[google id]
GOOGLE_SECRET=[google secret]

LINKEDIN_KEY=[linkedIn client id]
LINKEDIN_SECRET=[linkedIn secret]

TWITTER_KEY=[twitter client id]
TWITTER_SECRET=[twitter secret]
```
### Run

```sh
$ npm start
```

### TODOS

 - User Story: As an authenticated user, if I don't like the options on a poll, I can create a new option.
