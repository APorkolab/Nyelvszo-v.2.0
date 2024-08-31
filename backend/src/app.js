const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '20mb' }));

app.get('/', (req, res) => {
    const message = 'It works!\n';
    const version = 'NodeJS ' + process.versions.node + '\n';
    res.send([message, version].join('\n'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});