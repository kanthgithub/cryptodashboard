const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var Long = mongoose.Schema.Types.Long;

const marketdataSchema = mongoose.Schema({
    trackerIndex:  {type:Number, default:0},



    ContractAddress: String,
    TxHash: String,
    BlockIndex: {type:Number, default:0},
    logIndex: {type:Number, default:0},
    BlockHash: String,
    Age: {type:Number, default:0},
    From: String,
    TxType: String,
    To: String,
    Value: {type:Long, default:0},
    TxFee: {type:Number, default:0},
}, {
    timestamps: true
});

var TransactionLogData = module.exports = mongoose.model('MarketData', TxnlogSchema);
