
# millie

A small, zero dependency HTTP library for Node.JS

Have a question? Join the discord!

[![Discord Server](https://img.shields.io/badge/millie-https%3A%2F%2Fdiscord.gg%2FQGNGyF6j5q-blue?style=flat-square&logo=appveyor)](https://discord.gg/QGNGyF6j5q)
[![NPM](https://nodei.co/npm/millie.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/millie/)


## Features 📜

- Easy to use
- Small, around 2kb
- No dependencies
- Named after my cat 😁

  
## Basic Usage

```javascript
let millie = require("millie").millie;

let app = new millie(3000, { 
    "auth_secret": "api token or password for auth (optional)"
});

app.initialize();

app.request("/api", (req, res) => {
    res.status(200); //not really necessary unless you want to change the status code before responding
    res.message("status message"); //not really necessary if you use the custom respond() function

    res.respond(200, {"successful": "your request was successful"}) //body can also be a string
});
```

  
## Roadmap

- Custom request properties and functions

- More custom functions and properties for the response

- Local app storage

  