let http = require("http");

/**
 * A generator class that adds custom functions to http.ServerResponse
 * @class millie_res_generator
 */
class millie_res_generator {
  /**
   * Adds the custom functions to the http.ServerResponse prototype object
   */
  static generate() {
    /**
     * Sets the response status code
     * @param {number} code an HTTP status code
     */
    http.ServerResponse.prototype.status = function (code) {
      this.statusCode = code;
    };

    /**
     * Sets the response message
     * @param {string} message a message to send in the response
     */
    http.ServerResponse.prototype.message = function (message) {
      this.statusMessage = message;
    };

    /**
     *
     * @param {number} status_code an HTTP status code
     * @param {object|string} body an object or string to respond with
     * @returns
     */
    http.ServerResponse.prototype.respond = function (status_code, body) {
      switch (typeof body) {
        case !"object":
        case !"string":
          throw console.error("Body must be a string or an object!");
      }

      typeof body === "object"
        ? this.setHeader("Content-Type", "application/json")
        : this.setHeader("Content-Type", "text/plain");

      this.writeHead(status_code || this.status_code).end(
        Buffer.from(JSON.stringify(body))
      );

      return "Successfully sent a response.";
    };
  }
}

module.exports = {
  millie_res_generator,
};
