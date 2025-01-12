import axios from "axios";

export default async function POST(req, res) {

    try {
        const data = req.body;

        const contactData = {
            FirstName: data?.firstName,
            LastName: data?.lastName,
            Email: data?.email,
        }

        const settings =  {
            grant_type: "password",
            client_id: process.env.NEXT_PUBLIC_SALESFORCE_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_SALESFORCE_CLIENT_SECRET,
            username: process.env.NEXT_PUBLIC_SALESFORCE_USERNAME,
            password: `${process.env.NEXT_PUBLIC_SALESFORCE_PASSWORD}`,
        }

        const authResponse = await axios.post("https://login.salesforce.com/services/oauth2/token", new URLSearchParams(settings).toString(), { headers: { 'Content-Type':'application/x-www-form-urlencoded' } })

        const { access_token, instance_url } = authResponse.data;

        const createContactUrl = `${instance_url}/services/data/v54.0/sobjects/Contact/`;

        const response = axios.post(createContactUrl, JSON.stringify(contactData), { headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json'}})
        return res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error Linking Account', error })
        console.log(error)
        return error;
    }
}