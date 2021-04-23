const mongoose = require('mongoose');

const advert = mongoose.Schema({
    advertiser: String,
    server: String,
    rank: String
});

module.exports = mongoose.model('advert', advert);