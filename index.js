const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()

const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}


app.use(cors(corsConfig))
app.options("", cors(corsConfig))

app.use(express.json())





const uri = `mongodb+srv://${process.env.AYKOR_USER}:${process.env.AYKOR_PASSWORD}@cluster0.angef0s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const applicationsCollection = client.db('aykori').collection('applications')
        const jobsCollection = client.db('aykori').collection('jobs')


        //---get all aplication--

        app.get('/applications', async (req, res) => {
            const result = await applicationsCollection.find().toArray()
            res.send(result)
        })


        //---get all jobs--

        app.get('/jobs', async (req, res) => {
            const result = await jobsCollection.find().toArray()
            res.send(result)
        })

        //---post single job--

        app.post('/jobs', async (req, res) => {
            const job = req.body
            const result = await jobsCollection.insertOne(job)
            res.send(result)
        })

        //--- single job details--

        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await jobsCollection.findOne(query)
            res.send(result)
        })

        //---update single job --

        app.patch('/jobs/:id', async (req, res) => {
            const id = req.params.id
            const updateJob = req.body
            const filter = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    ...updatedDoc
                }
            }
            const result = await jobsCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })

        //---delete single job --

        app.delete('/jobs/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await jobsCollection.deleteOne(query)
            res.send(result)
        })










        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('aykor is running')
})

app.listen(port, () => {
    console.log(`aykor is running on port, ${port}`)
})