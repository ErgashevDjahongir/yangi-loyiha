const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017';
const dbName = 'notesdb';

let db;
MongoClient.connect(mongoUrl)
  .then(client => {
    db = client.db(dbName);
    console.log('Connected to MongoDB', mongoUrl);
  })
  .catch(err => {
    console.error('Mongo connection error', err);
  });

// Routes
app.get('/api/notes', async (req, res) => {
  const notes = await db.collection('notes').find().toArray();
  res.json(notes);
});

app.post('/api/notes', async (req, res) => {
  const note = { text: req.body.text || '', created: new Date() };
  const r = await db.collection('notes').insertOne(note);
  res.json({ insertedId: r.insertedId });
});

app.delete('/api/notes/:id', async (req, res) => {
  const id = req.params.id;
  await db.collection('notes').deleteOne({ _id: new ObjectId(id) });
  res.json({ ok: true });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Backend listening on', port));
