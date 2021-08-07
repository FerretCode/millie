let axios = require('axios').default

axios.get('http://localhost:3004').then(res => {
  console.log(res)
});
