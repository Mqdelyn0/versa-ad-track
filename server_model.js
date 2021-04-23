const mongoose = require('mongoose');

const server = mongoose.Schema({
    ad_party: Number,
    server: String
});

module.exports = mongoose.model('server', server);