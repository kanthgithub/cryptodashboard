const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Long = mongoose.Schema.Types.Long;

const tickerdataSchema = mongoose.Schema({
    id: String,
    name: String,
    symbol: String,
    rank: Number,
    maximumSupply: {type:Long, default:0},
    totalSupply: {type:Long, default:0},
    availableSupply: {type:Long, default:0}
}, {
    timestamps: true
});

var tickerDataEntity = module.exports = mongoose.model('tickerdata', tickerdataSchema);


module.exports.getTickerBySymbol = function(symbol, callback) {
    var query = {symbol: symbol};
    tickerDataEntity.findOne(query, callback);
};

module.exports.getTickerById = function(id, callback) {
    var query = {id: symbol};
    tickerDataEntity.findOne(query, callback);
};

module.exports.getTickerByRank = function(rank, callback) {
    var query = {rank: rank};
    tickerDataEntity.findOne(query, callback);
};

module.exports.getAllTickers = function(callback) {
    tickerDataEntity.find(callback);
};

module.exports.deleteAllTickers = function (callback) {
    tickerDataEntity.deleteMany({},callback);
}

module.exports.saveOrUpdate = function (tickerDataEntityToPersist) {

    exports.getTickerBySymbol(tickerDataEntityToPersist.symbol).then((model) => {
                                return Object.assign(model,
                                    {
                                        totalSupply: tickerDataEntityToPersist.symbol,
                                        maximumSupply: tickerDataEntityToPersist.maximumSupply,
                                        rank: tickerDataEntityToPersist.rank,
                                        availableSupply: tickerDataEntityToPersist.availableSupply
                                    }).then( (model) => {
                                                return model.save();
                                            })
                                      .then((updatedModel) => {
                                            return updatedModel;
                                      }).catch((err) => {
                                          return null;
                                    });
                            });

}
