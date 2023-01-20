import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
    try {
        const client = await clientPromise;
        const { email, password, nombre, nit, direccion, telefono } = req.body;
        const db = client.db("registro-empresarial");
        const record = await db.collection('empresas').deleteOne({ nit });
        res.json(record.deletedCount);
    } catch (e) {
        console.error({e});
        if (e.code && e.code === 11000) {
            res.status(500).json({error:'Duplicated NIT'});
        } else {
            res.status(500).json({error:e});
        }
    }
}