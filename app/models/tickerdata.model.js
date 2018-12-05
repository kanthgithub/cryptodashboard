const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Long = mongoose.Schema.Types.Long;

const tickerdataSchema = mongoose.Schema({
    tickerIndex:  {type:Number, default:0},
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

var tickerdata = module.exports = mongoose.model('tickerdata', tickerdataSchema);
