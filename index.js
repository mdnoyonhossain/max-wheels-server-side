const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

const app = express();

// midelware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.n3a0m.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const productCategoryCollection = client.db('maxwheels').collection('productCategory');
        const categoryCollection = client.db('maxwheels').collection('category');
        const bookingCollection = client.db('maxwheels').collection('booking');
        const usersCollection = client.db('maxwheels').collection('users');
        const reportCollection = client.db('maxwheels').collection('reportadmin');

        app.get('/productCategory', async (req, res) => {
            const query = {};
            const result = await productCategoryCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/dashboard/productCategory', async (req, res) => {
            const email = req.query.email;
            const query = {email};
            const result = await productCategoryCollection.find(query).toArray();
            res.send(result)
        });

        app.get('/productCategory/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCategoryCollection.findOne(query);
            res.send(product);
        });

        app.get('/reportadmin', async (req, res) => {
            const query = {};
            const result = await reportCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/productCategory', async (req, res) => {
            const products = req.body;
            const resutl = await productCategoryCollection.insertOne(products);
            res.send(resutl)
        });

        
        app.post('/reportadmin', async (req, res) => {
            const report = req.body;
            const result = await reportCollection.insertOne(report);
            res.send(result)
        })

        

    }
    finally {

    }
}

run().catch(error => console.log(error))

app.get('/', async (req, res) => {
    res.send('Max Wheels Server is Running');
});

app.listen(port, () => {
    console.log(`Max wheels server on ${port}`);
})