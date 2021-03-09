const app = require('./server.js')
const config = require('./config');

app.listen(config.port, () => console.log('Started at ' + config.port))
