import mongoose from "./database.js";

const counterSchema = new mongoose.Schema({
    id: String,
    seq: Number
});

const Counter = mongoose.model("Counter", counterSchema);

export default async function getIncrementId (collectionName) {
    let seqId;
    seqId = await Counter.findOneAndUpdate({id: collectionName},
        {"$inc": {"seq": 1}}, { new: true })
        .then(result => {
            seqId = result.seq;
            return seqId;
        }).catch(() => {
            const newVal = new Counter({id: collectionName, seq: 1});
            newVal.save();
            seqId=1;
            return seqId;
        });
    return seqId;
}