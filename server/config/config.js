process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb+srv://root:ripppa123@cluster0-y1g0q.mongodb.net/Antojitos';
} else {
    urlDB = 'mongodb+srv://root:ripppa123@cluster0-y1g0q.mongodb.net/Antojitos';
}
process.env.URLDB = urlDB;

process.env.SEED = process.env.SEED || 'firma-super-secreta';


process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || '3h';
