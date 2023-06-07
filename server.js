const express = require('express');
const axios = require('axios');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 8000;
let bitcoinPrice = '';

app.use(cors()); // Thêm dòng này để cho phép CORS
// Lấy giá Bitcoin từ Coindesk API
const fetchBitcoinPrice = async () => {
    try {
        const response = await axios.get('https://api.coindesk.com/v1/bpi/currentprice/BTC.json');
        const price = response.data.bpi.USD.rate_float;
        return price;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Cập nhật giá Bitcoin và gửi tới tất cả kết nối WebSocket
const updateBitcoinPrice = async () => {
    const price = await fetchBitcoinPrice();
    if (price !== null) {
        bitcoinPrice = price.toFixed(2);
        wss.clients.forEach((client) => {
            client.send(JSON.stringify({ price: bitcoinPrice, time: new Date() }));
        });
    }
};

// Thiết lập kết nối WebSocket
wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ price: bitcoinPrice, time: new Date() }));
});

// Cập nhật giá Bitcoin mỗi 1 phút
setInterval(updateBitcoinPrice, 60000);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
