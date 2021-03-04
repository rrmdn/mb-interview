const express = require('express');
const app = express();

const data = JSON.parse(require('fs').readFileSync('data.json', 'utf-8'));

app.get('/ping', function (req, res) {
    return res.send(`OK ${Date.now()}`);
});

app.get('/search', function (req, res) {
    const { term } = req.query;
    if (!term) {
        return res.json(data);
    }
    const q = term.toLowerCase();
    const match = ({ name }) => name.toLowerCase().indexOf(q) >= 0;
    const result = data.filter(match);
    return res.json(result);
});

app.listen(process.env.PORT || 8080);