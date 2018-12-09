const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Long = mongoose.Schema.Types.Long;

const marketdataSchema = mongoose.Schema({
    "id": {type: Number, default: 0},
    "name": String,
    "symbol": String,
    "slug": String,
    "circulating_supply": {type: Long, default: 0},
    "total_supply": {type: Long, default: 0},
    "max_supply": {type: Long, default: 0},
    "date_added": String,
    "num_market_pairs": {type: Long, default: 0},
    "tags": String,
    "platform": String,
    "cmc_rank": {type: Number, default: 0},
    "last_updated": String,
    "price": {type: Number, default: 0},
    "volume_24h": {type: Number, default: 0},
    "percent_change_1h": {type: Number, default: 0},
    "percent_change_24h": {type: Number, default: 0},
    "percent_change_7d": {type: Number, default: 0},
    "market_cap": {type: Number, default: 0},
    "last_updated": String
    }, {
        timestamps: true
    });


var marketDataEntity = module.exports = mongoose.model('MarketDataSnapshot', marketdataSchema);

module.exports.captureMarketDataSnapshot = function (marketDataEntityToPersist) {

    marketDataEntityToPersist.save();

}
