let http = require("http");
let crypto = require("crypto");

let millie_response = require("./classes/res");

/**
 * The millie app class
 * @class millie
 */
class millie {
  /**
   *
   * @param {number} port the port number to open the server on
   * @param {object} options an object containing options for initializing millie
   * @param {string} options.auth_secret a token or password for basic authentication
   */
  constructor(port, options) {
    this.options = options || {};

    /**
     * Starts server and generates custom response functions
     * @returns {http.Server} an http server
     */
    this.initialize = () => {
      if (!parseInt(port))
        return console.error("Port needs to be a valid number!");

      /**
       * @type {http.Server} an http server
       */
      this.server = http.createServer();

      console.log("Running setup...");

      try {
        millie_response.millie_res_generator.generate();
      } catch (e) {
        throw console.error(
          `An error occurred while adding custom functions to http.ServerResponse! Error: `,
          e
        );
      }

      this.server.listen(port || 3000);

      console.log(`Now listening on port ${port || 3000}`);

      return this.server;
    };

    /**
     * Timing safe compares user input to real value
     * @param {string} input the user input token
     * @param {string} token the actual token to compare against
     * @returns {boolean} a boolean representing whether or not the auth succeeded
     */
    this.auth = (input, token) => {
      if (!(typeof input === "string") || !(typeof token === "string"))
        return console.error("Input and token must be strings!");

      let input_buf = Buffer.alloc(Buffer.byteLength(input), 0, "utf-8");
      input_buf.write(input);

      let token_buf = Buffer.alloc(Buffer.byteLength(token), 0, "utf-8");
      token_buf.write(token);

      if (Buffer.byteLength(input) !== Buffer.byteLength(token)) return false;

      return crypto.timingSafeEqual(input_buf, token_buf);
    };

    /**
     * A function that calls a callback when a request is sent
     * @param {string} route the route to listen for requests on
     * @param {function(http.ClientRequest, http.ServerResponse)} callback the callback to run
     */
    this.request = (route, callback) => {
      this.server.on("request", (req, res) => {
        let url = route;

        if (!url.startsWith("/")) url = "/" + url;

        if (req.url !== url) return;

        if (this.options.hasOwnProperty("auth_secret"))
          if (!req.headers["authorization"]) {
            res.writeHead(401, "Unauthorized! No credentials provided!").end();

            return;
          } else if (
            !this.auth(req.headers["authorization"], this.options.auth_secret)
          ) {
            res.writeHead(401, "Unauthorized! Invalid credentials!").end();

            return;
          }

        callback(req, res);
      });
    };
  }
}

module.exports = {
  millie,
};
