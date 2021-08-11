let http = require("http");
let crypto = require("crypto");

let millie_response = require("./classes/res");

class millie {
    constructor(port, options) {
        this.options = options || {};

        this.initialize = () => {
            if (!parseInt(port))
                return console.error("Port needs to be a valid number!");

            this.server = http.createServer();

            console.log("Running setup...");

            try {
                millie_response.millie_res_generator.generate();
            } catch(e) {
                throw console.error(
                    `An error occurred while adding custom functions to http.ServerResponse! Error: `,
                    e
                )
            }

            this.server.listen(port || 3000);

            console.log(`Now listening on port ${port || 3000}`);

            return this.server;
        };

        this.auth = (input, token) => {
            if (!(typeof input === "string") || !(typeof token === "string"))
                return console.error("Input and token must be strings!");

            let input_buf = Buffer.alloc(Buffer.byteLength(input), 0, "utf-8");
            input_buf.write(input);

            let token_buf = Buffer.alloc(Buffer.byteLength(token), 0, "utf-8");
            token_buf.write(token);

            if (Buffer.byteLength(input) !== Buffer.byteLength(token))
                return false;

            return crypto.timingSafeEqual(input_buf, token_buf);
        };

        this.request = (route, callback) => {
            this.server.on("request", (req, res) => {
                let url = route;

                if (!url.startsWith("/")) url = "/" + url;

                if (req.url !== url) return;

                if (this.options.hasOwnProperty("auth_secret"))
                    if (!req.headers["authorization"]) {
                        res.writeHead(
                            401,
                            "Unauthorized! No credentials provided!"
                        ).end();

                        return;
                    } else if (!this.auth(req.headers["authorization"], this.options.auth_secret)) {
                        res.writeHead(
                            401,
                            "Unauthorized! Invalid credentials!"
                        ).end();

                        return;
                    }

                callback(req, res);
            });
        };
    }
}

module.exports = {
    millie
};
