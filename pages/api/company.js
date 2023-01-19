import clientPromise from "../../lib/mongodb";


export default async (req, res) => {  
    try {
        const { nombre, nit, direccion, telefono } = req.body
        const client = await clientPromise;
        const db = client.db("sample_mflix");
        const record = await db.collection('empresas').insertOne({nombre, nit, direccion, telefono});
        res.json(record.acknowledged);
    } catch (e) {
        console.error(e);
        res.json(false);
    }
  }