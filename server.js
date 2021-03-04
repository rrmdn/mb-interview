const express = require('express');
const app = express();

app.get('/ping', function (req, res) {
    return res.send(`OK ${Date.now()}`);
});

app.listen(process.env.PORT || 8080);