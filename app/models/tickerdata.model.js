const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Long = mongoose.Schema.Types.Long;
const await = require('await');


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

var tickerDataEntity = module.exports = mongoose.model('cryptotickerstatic', tickerdataSchema,'cryptotickerstatic');


module.exports.getTickerBySymbol = function(symbol) {
    var query = {symbol: symbol};
    return tickerDataEntity.findOne(query);
};

module.exports.getTickerById = function(id, callback) {
    var query = {id: symbol};
    tickerDataEntity.findOne(query, callback);
};

module.exports.getTickerByRank = function(rank, callback) {
    var query = {rank: rank};
    tickerDataEntity.findOne(query, callback);
};

module.exports.getAllTickers = function() {
    return tickerDataEntity.find();
};

module.exports.deleteAllTickers = function (callback) {

    console.log("inside model - to delete all entities");

    tickerDataEntity.remove({}).exec().then(function(){

    tickerDataEntity.find().then(function(result){
        if(result) {
            console.log("found after delete: " + result);
        }else{
            console.log("deleted successfully")
        }
    })});

};

module.exports.saveOrUpdateEntity = function (tickerDataEntityToPersist) {

    tickerDataEntity.update(
        {symbol: tickerDataEntityToPersist.symbol},
        {upsert: true, safe: true},
        function(err,data){
            if (err){
                console.log(err);
            }
        }
    );
}
