let http = require('http');

class millie {
  constructor(port, options) {
    this.initialize = () => {
      if(!parseInt(port))
        return console.error(
          'Port needs to be a valid number!'
        );
      
      this.server = http.createServer();
      
      this.server.listen(port || 3000);
      
      console.log(
        `Now listening on port ${port || 3000}`
      );
      
      return this.server;
    }
    
    this.request = (route, callback) => {
      this.server.on('request', (req, res) => {
        let url = route;
        
        console.log(url)
        
        if(!url.startsWith('/'))
          url = '/' + url;
          
        if(req.url !== url)
          return;
          
        callback(req, res);
      });
    }
  }
} 

let millieInstance = new millie(3004, {});

millieInstance.initialize();
millieInstance.request('/', (req, res) => {
  console.log(req);
});
