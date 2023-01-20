import clientPromise from "../../lib/mongodb";


const subscribe = async (email) => {
    if (!email || !email.length) {
        return res.status(400).json({ error: 'Email is required' })
    }

    const API_KEY = process.env.MAILCHIMP_API_KEY
    const API_SERVER = process.env.MAILCHIMP_API_SERVER
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID

    const url = `https://${API_SERVER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;

    const data = {
        email_address: email,
        status: 'subscribed'
    }

    const options = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `api_key ${API_KEY}`
        }
    }

    try {
        console.info("Sending email");
        const response = await axios.post(url, data, options);
        if (response.status >= 400)
            throw "Error when subscribing email to newsletter";
        return true;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export default async (req, res) => {
    try {
        const client = await clientPromise;
        const { email, password, nombre, nit, direccion, telefono } = req.body;
        const db = client.db("registro-empresarial");
        const record = await db.collection('empresas').insertOne({ email, password, nombre, nit, direccion, telefono });
        res.json(record.insertedId);
    } catch (e) {
        console.error({e});
        if (e.code && e.code === 11000) {
            res.status(500).json({error:'Duplicated NIT'});
        } else {
            res.status(500).json({error:e});
        }
    }
}