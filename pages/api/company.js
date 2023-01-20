import clientPromise from "../../lib/mongodb";


export default async (req, res) => {  
    try {
        const client = await clientPromise;
        const { email, password, nombre, nit, direccion, telefono } = req.body;
        console.info('Preparing insert...')
        const db = client.db("sample_mflix");
        const record = await db.collection('empresas').insertOne({email, password, nombre, nit, direccion, telefono});
        console.info('Inserted');
        res.json(record.insertedId);
    } catch (e) {
        console.error(e);
        res.error = e;
        res.json(false);
    }
  }