const http = require("http");

class MillieResponse extends http.ServerResponse {
  constructor(req) {
    super(req);

    /**
     * A function that sends a response back to the client
     * @param {number} statusCode an HTTP status code
     * @param {object|string} body an object or string to respond with
     * @returns a string
     */
    this.respond = function (statusCode, body) {
      switch (typeof body) {
        case !"object":
        case !"string":
          throw console.error("Body must be a string or an object!");
      }

      typeof body === "object"
        ? this.setHeader("Content-Type", "application/json")
        : this.setHeader("Content-Type", "text/plain");

      this.writeHead(statusCode || this.statusCode).end(
        Buffer.from(JSON.stringify(body))
      );

      return "Successfully sent a response.";
    };

    /**
     * Sets the response message
     * @param {string} message a message to send in the response
     */
    this.message = function (message) {
      this.statusMessage = message;
    };

    /**
     * Sets the response status code
     * @param {number} code an HTTP status code
     */
    this.status = function (code) {
      this.statusCode = code;
    };
  }
}

module.exports = {
  MillieResponse,
};
