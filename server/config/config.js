const env = process.env.NODE_ENV || 'development' ;


if (env === 'development' || env === 'test'){ // use local config file when env is not production
    const config = require('./config.json')[env]; // json will automatically convert to js object 
    Object.keys(config).forEach(key=>{
        process.env[key] = config[key]; 
    })
}
