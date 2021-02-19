const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const fs = require('fs-extra');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 5000;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bdvqy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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


    // add appointment --------------------------------------------------------------------------
    app.post('/appointment', (req, res) => {
        const appointment = req.body;
        AppointmentCollection.insertOne(appointment)
            .then(result => {
                result.send(insertedCount > 0)
            })
    });


    //find appointment by date----------------------------------------------------------------------
    app.post('/appointmentByDate', (req, res) => {
        const date = req.body.date;
        const email = req.body.email;
        DoctorCollection.find({ email: email })
            .toArray((err, doctors) => {
                const filter = { date: date }
                if (doctors.length === 0) {
                    filter.email = email;
                }
                AppointmentCollection.find(filter)
                    .toArray((err, documents) => {
                        res.send(documents)
                    })
            })
    });


    // add doctor on home page------------------------------------------------------------------
    app.post('/addDoctor', (req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        const file = req.files.file;

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: `${file.name}`
        };
        //  -------------save image on doctors folder-------------
        file.mv(`${__dirname}/doctor/${file.name}`, err => {
            if (err) {
                alert('Error')
                return res.status(500).send({ msg: 'fail to upload' })
            }
            DoctorCollection.insertOne({ name, email, image })
                .then(result => {
                    res.send(result.insertedCount > 0);
                });
            return res.send({ name: file.name, path: `${file.name}` })
        });
    });


    // face doctor in home page--------------------------------------------------------------------
    app.get('/doctors', (req, res) => {
        DoctorCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

   // sidebar manue control ----------------------------------------------------------------------
    app.post('/isDoctor', (req, res) => {
        const email = req.body.email;
        DoctorCollection.find({ email: email })
            .toArray((err, doctors) => {
              res.send( doctors.length > 0)
            })
    });

    //All Patient control ----------------------------------------------------------------
    app.get ("/allPatients" , (req, res) => {
        AppointmentCollection.find({})
        .toArray((err ,documents) => {
            res.json(documents)
        })
    })



    console.log('connect');
});



app.listen( port,()=>console.log(`connected database server${port}`));

// // add doctor on home page------------------------
// app.post('/addDoctor', (req, res) => {
//     const name = req.body.name;
//     const email = req.body.email;
//     const file = req.files.file;
//     const filePath = `${__dirname}/doctor/${file.name}`;
//     console.log(name, email, image);

//     //  -------------save image on doctors folder-------------
//     file.mv(filePath, err => {
//         if (err) {
//             alert('Error')
//             console.log('error 404');
//             return res.status(500).send({ msg: 'fail to upload' })
//         }
//         var newImage = fs.readFileSync(filePath);
//         var encImg = newImage.toString('base64');

//         var image = {
//             contentType: req.files.file.mimetype,
//             size: req.files.file.size,
//             img: Buffer(encImg , 'base64')
//         };
//         DoctorCollection.insertOne({ name, email, image })
//             .then(result => {
//                 fs.remove(filePath , error => {
//                     if(error){
//                         alert(error);
//                     }
//                     res.send(result.insertedCount > 0);
//                 })

//                 console.log(result);
//             });
//         return res.send({ name: file.name, path: `${file.name}` })
//     });
// });