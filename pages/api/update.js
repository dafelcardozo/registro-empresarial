import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const { key, field, newValue } = req.body;
        const db = client.db("registro-empresarial");
        const update = {[field]:newValue};
        const record = await db.collection('empresas').updateOne({ nit:key }, { '$set': update}, {});
        res.json(record.modifiedCount);
    } catch (e) {
        if (e.code && e.code === 11000) {
            res.status(500).json({error:'Duplicated NIT'});
        } else {
            console.error({e});
            res.status(500).json({error:e});
        }
    }
}