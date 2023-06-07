const express = require('express');
const axios = require('axios');

const app = express();
const port = 8000;

app.get('/api/bitcoin', async (req, res) => {
    try {
        const response = await axios.get('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
        const price = response.data.bpi.USD.rate_float;
        res.json({ price });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
