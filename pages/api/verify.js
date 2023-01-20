import clientPromise from "../../lib/mongodb";


export default async (req, res) => {  
    try {
        const { email, password } = req.body
        const client = await clientPromise;
        const db = client.db("sample_mflix");
        const record = await db.collection('empresas')
        .findOne({email, password});
        res.json(record);
    } catch (e) {
        console.error(e);
        res.status(500).json(false);
    }
  }