const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Correct MongoDB connection string
const DB = 'mongodb+srv://abhya1207:Abhishek1207@cluster0.tkiiprp.mongodb.net/contactdata?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connection successful');
}).catch((err) => {
  console.log('No connection:', err);
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.log('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

const userSchema2 = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const UserN = mongoose.model('UserN', userSchema2);

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  const newUser = new UserN({ name, email, message });

  try {
    await newUser.save();
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving data to the database');
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server has started successfully on port ${PORT}`);
});
