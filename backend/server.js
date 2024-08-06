const express = require('express');
const cors = require('cors');  // Import cors
const app = express();
const port = 3000;

app.use(cors());  // Use cors

let requestCounter = 0;  // Initialize request counter

// Function to determine if we should send a 429 status code
const shouldSend429 = () => {
    return Math.random() < 0.11;  // Approximately 1/3 of the time
};

//express required
// Give another http status(429) every three-four times randomly
app.get('/order', (req, res) => {
    requestCounter++;
    if (shouldSend429()) {
        return res.status(429).send('Too Many Requests');
    }

    const order = [
        { id: 1, name: 'Cool Shirt', price: 25.0, qty: 3, weight: 0.5 },
        { id: 2, name: 'Cool Pants', price: 45.0, qty: 2, weight: 1 },
        { id: 3, name: 'Light Saber', price: 125.0, qty: 1, weight: 5 }
    ];
    res.json({ order });
});

app.get('/shipping', (req, res) => {
    requestCounter++;
    if (shouldSend429()) {
        return res.status(429).send('Too Many Requests');
    }

    const totalWeight = req.query.weight;
    const shipping = {
        carrier: 'UPS',
        address: {
            name: 'Amanda Miller',
            phone: '555-555-5555',
            address_line1: '525 S Winchester Blvd',
            city_locality: 'San Jose',
            state_province: 'CA',
            postal_code: '95128',
            country_code: 'US'
        },
        cost: 7.99
    };
    res.json({ shipping });
});

app.get('/tax', (req, res) => {
    requestCounter++;
    if (shouldSend429()) {
        return res.status(429).send('Too Many Requests');
    }

    const tax = {
        amount: 0.07
    };
    res.json({ tax });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
