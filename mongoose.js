const mongoose = require("mongoose");

module.exports = {
    init: async() => {
        const database_options = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            poolSize: 5,
            connectTimeoutMS: 5000,
            family: 4
        };
        mongoose.connect(`mongodb://GenversaMongo:skMaxCECjRFbP5Heb89QZZ5M2S9UVrwZYwqsWeSccye47pNFqL@51.79.32.219:27017/Genversa?authSource=Genversa&readPreference=primary&appname=MongoDB%20Compass&ssl=false`, database_options);
        mongoose.set('useFindAndModify', false);
        mongoose.Promise = global.Promise;
        mongoose.connection.on('connected', () => {
            console.log('Successfully logged into MongoDB!');
        });
        mongoose.connection.on('err', (error) => {
            console.log(`There was a error with MongoDB:\n${error}`);
        });
        mongoose.connection.on('disconnected', () => {
            console.log(`Disconnected from MongoDB!`);
        });
    },
}