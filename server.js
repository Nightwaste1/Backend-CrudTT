const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Conectar a MongoDB (sin opciones deprecadas)
mongoose.connect('mongodb://localhost/pets');

// Configurar el motor de plantillas
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Esquema y Modelo de Mascota
const petSchema = new mongoose.Schema({
  name: String,
  age: Number,
  type: String
});

const Pet = mongoose.model('Pet', petSchema);

// Rutas
app.get('/', async (req, res) => {
  const pets = await Pet.find();
  res.render('index', { pets });
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/pets', async (req, res) => {
  const { name, age, type } = req.body;
  await Pet.create({ name, age, type });
  res.redirect('/');
});

app.get('/pets/:id/edit', async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  res.render('edit', { pet });
});

app.post('/pets/:id', async (req, res) => {
  const { name, age, type } = req.body;
  await Pet.findByIdAndUpdate(req.params.id, { name, age, type });
  res.redirect('/');
});

app.post('/pets/:id/delete', async (req, res) => {
  await Pet.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
