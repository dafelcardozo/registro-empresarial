import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
   try {
       const client = await clientPromise;
       const db = client.db("registro-empresaria");
       const empresas = await db
           .collection("empresas")
           .find({})
           .toArray();
       res.json(empresas);
   } catch (e) {
       console.error(e);
   }
};