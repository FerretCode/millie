let http = require("http");

class millie_res_generator {
    static generate() {
        http.ServerResponse.prototype.status = function(code) {
            this.statusCode = code;
        }

        http.ServerResponse.prototype.message = function(message) {
            this.statusMessage = message;
        }

        http.ServerResponse.prototype.respond = function(status_code, body) {
            switch(typeof body) {
                case !"object":
                case !"string":
                    throw console.error("Body must be a string or an object!");
            }

            typeof body === "object" ? 
                this.setHeader("Content-Type", "application/json") :
                this.setHeader("Content-Type", "text/plain");

            this.writeHead(status_code || this.status_code).end(Buffer.from(JSON.stringify(body)));

            return "Successfully sent a response.";
        }
    }
}

module.exports = {
    millie_res_generator
}