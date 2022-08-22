// Iniciar base de datos con comando "mongod" y "mongo" en terminal
// Iniciar server con npm run devuse
// Ver datos en base de datos con db.contactos.find().pretty()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { type } = require('express/lib/response');
const MongoDB_URL = 'mongodb://localhost/miAgendaConMongo';
const Schema = mongoose.Schema;
const model = mongoose.model;

// Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

// Middlewares
app.use(express.urlencoded({extended:false})); // Cuando lleguen datos del formulario convertirlos en formato json

// Base de Datos
mongoose.connect(MongoDB_URL, {
  // configuración en caso de errores  
  useUnifiedTopology: true,
   useNewUrlParser: true
})
.then(db => console.log('La base de datos esta conectada'))
.catch(err => console.log(err));

// Modelos y Esquemas de la base de datos
const ContactoSchema = new Schema({ // Definición de los datos basados en el esquema
    Nombre: String,
    NumeroCasa: Number,
    NumeroCelular: Number,
    Relacion: String
});

const Contacto = model('Contacto', ContactoSchema);

// Rutas
// Página de inicio
app.get('/', (req, res) => {
    res.render('index');
});

// Página del formulario para agregar contactos
app.get('/Nuevo-Contacto', (req, res) => {
    res.render('nuevo');
});

app.post('/Nuevo-Contacto', async (req, res) => {
    const {Nombre, NumeroCasa, NumeroCelular, Relacion } = req.body;

    const NuevoContacto = new Contacto({Nombre, NumeroCasa, NumeroCelular, Relacion});
    await NuevoContacto.save();

    res.redirect('/Ver-Contactos');
});

// Página para ver los contactos agregados
app.get('/Ver-Contactos', async (req, res) => {
    const Contactos = await Contacto.find();
    res.render('contactos', { Contactos});
});

// Puerto del servidor
app.listen(app.get('port'), () => {
    console.log('Server abierto en el puerto:',app.get('port'));
});