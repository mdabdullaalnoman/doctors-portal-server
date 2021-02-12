const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
// const port = process.env.PORT || 5000;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bdvqy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true ,  useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('doctor'));
app.use(fileUpload());

app.get('/', (req, res) => {
    res.send('this is working success fully')
})

client.connect(err => {
  const AppointmentCollection = client.db("Doctors-Portal").collection("appointment");
  const DoctorCollection = client.db("Doctors-Portal").collection("doctors");

  app.post('/appointment', (req, res) => {
      const appointment = req.body;
      AppointmentCollection.insertOne(appointment)
      .then( result => {
          result.send(insertedCount > 0)
      })
  });

  app.post('/appointmentByDate', (req, res) => {
    const date = req.body;
    console.log(date.date);
    AppointmentCollection.find({date:date.date})
    .toArray((err , documents) => {
        res.send(documents)
        console.log(documents);
    })
});

app.post('/addDoctor' , (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const file = req.files.file;
    
    file.mv(`${__dirname}/doctors/${file.name}`, err => {
        if(err) {
            console.log('error 404');
            return res.status(500).send({msg:'fail to upload'})
        }
        return res.send({name: file.name , path: `${file.name}`})
    })
    console.log(file , name , email);
})


app.get('/doctor' ,(req, res) => {

})




console.log('connect');
});



// app.listen( port,()=>console.log(`connected database server${port}`));
app.listen(5000);



