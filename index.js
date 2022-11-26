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

        app.delete('/report/:id', async (req, res) =>{
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const result = await reportCollection.deleteOne(filter);
            res.send(result);
        })

        app.put('/advertise/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const options= {upsert: true};
            const updatedDoc = {
                $set: {
                    advertise: 'advertise'
                }
            }
            const result = await productCategoryCollection.updateOne(filter, updatedDoc, options);
            res.send(result)
        })

       

        app.delete('/productCategory/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await productCategoryCollection.deleteOne(filter);
            res.send(result)
        })

        app.get('/category', async (req, res) => {
            const query = {};
            const result = await categoryCollection.find(query).toArray();
            res.send(result);
        });

        // booking
        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const bookings = await bookingCollection.find(query).toArray();
            res.send(bookings)
        })

        app.post('/booking', async (req, res) => {
            const user = req.body;
            const booking = await bookingCollection.insertOne(user);
            res.send(booking);
        });

        // Users
        app.get('/user/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' });
        });

        app.get('/user/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        });

        app.get('/user/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isBuyer: user?.role === 'buyer' });
        });

        app.get('/users', async (req, res) => {
            const role = req.query.email;
            const query = { role: role };
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        app.put('/user/verified/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const options= {upsert: true};
            const updatedDoc = {
                $set: {
                    verified: 'verified'
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const user = await usersCollection.deleteOne(filter);
            res.send(user)
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