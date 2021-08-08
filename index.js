let http = require("http");
let crypto = require("crypto");

class millie {
  constructor(port, options) {
    this.options = options || {};

    this.initialize = () => {
      if (!parseInt(port))
        return console.error("Port needs to be a valid number!");

      this.server = http.createServer();

      this.server.listen(port || 3000);

      console.log(`Now listening on port ${port || 3000}`);

      return this.server;
    };

    this.auth = (input, token) => {
      if (!(typeof input === "string") || !(typeof token === "string"))
        return console.error("Input and token must be strings!");

      let input_buf = Buffer.from(input);
      let token_buf = Buffer.from(token);

      return crypto.timingSafeEqual(input_buf, token_buf);
    };

    this.request = (route, callback) => {
      this.server.on("request", (req, res) => {
        let url = route;

        if (!url.startsWith("/")) url = "/" + url;

        if (req.url !== url) return;

        if (this.options.hasOwnProperty("auth_secret"))
          if (!req.headers["Authorization"]) {
            res.writeHead(401, "Unauthorized! No credentials provided!").end();
          } else if (
            !this.auth(req.headers["Authorization"], this.options.auth_secret)
          )
            res.writeHead(401, "Unauthorized! Invalid credentials!").end();

        callback(req, res);
      });
    };
  }
}

let millieInstance = new millie(3005, { auth_secret: "gaming" });

millieInstance.initialize();
millieInstance.request("/", (req, res) => {
  console.log(req);
});
