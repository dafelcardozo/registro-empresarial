import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
   try {
       const client = await clientPromise;
       const db = client.db("sample_mflix");
       const empresas = await db
           .collection("empresas")
           .find({})
           .toArray();
       res.json(empresas);
   } catch (e) {
       console.error(e);
   }
};