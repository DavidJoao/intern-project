import axios from "axios";

export default async function (req, res) {
    const data = req.body;
    const { email } = req.query;

    const settings =  {
        grant_type: "password",
        client_id: process.env.NEXT_PUBLIC_SALESFORCE_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_SALESFORCE_CLIENT_SECRET,
        username: process.env.NEXT_PUBLIC_SALESFORCE_USERNAME,
        password: `${process.env.NEXT_PUBLIC_SALESFORCE_PASSWORD}`,
    }

    try {
        const authResponse = await axios.post("https://login.salesforce.com/services/oauth2/token", new URLSearchParams(settings).toString(), { headers: { 'Content-Type':'application/x-www-form-urlencoded' } })
        
        const accessToken = authResponse.data.access_token;
        const instanceUrl = authResponse.data.instance_url;
    
        const query = `SELECT Id, FirstName, LastName, Email FROM Contact WHERE Email = '${email}'`;
        const queryResponse = await axios.get(`${instanceUrl}/services/data/v57.0/query?q=${encodeURIComponent(query)}`, { headers: { Authorization: `Bearer ${accessToken}` }} )
    
        const records = queryResponse.data.records;
    
        if (records.length > 0) {
            return res.status(200).json({
                message: "Contact found",
                contact: records[0],
            });
        } else {
            return res.status(404).json({
                message: "No contact found with the provided email.",
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to check contact in Salesforce." });
    }

}