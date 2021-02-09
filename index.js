const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const port = process.env.PORT || 5000;
require('dotenv').config()




const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('this is working success fully')
})


// app.listen( port,()=>console.log(`connected database server${port}`));

app.listen(5000, console.log('connect'));



