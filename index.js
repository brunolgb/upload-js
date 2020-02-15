const express = require('express')
const app = express()
const multer = require('multer')
const fs = require('fs');
const os = require('os');

//verification directory exists
const directory = 'uploads';
if (!fs.existsSync(directory)) {
    fs.mkdir(directory, (errorCreator) => {
        if (errorCreator) {
            console.log("Não foi possivel criar a pasta de uploads");
        } else {
            console.log("Pasta de Uploads criada com sucesso!");
        }
    })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage })
app.set('view engine', 'ejs')

app.use(express.static('.'));
app.get('/', (req, res) => {
    res.render('home')
});
app.post('/', upload.single('img'), (req, res) => {
    console.log(req.body, req.file)
    res.send('Arquivo enviado com sucesso, encontre a pasta de downloads')
})
const port = 3000;
app.listen(port, () => {
    const ifaces = os.networkInterfaces();
    const res = Object.keys(ifaces);
    let addressFilter = null;
    for (let i = 0; i < res.length; i++) {
        const element = ifaces[res[i]];
        addressFilter = element.filter(e => {
            const address = e.address;
            if (address.length > 8 & address.length < 15) {
                return address
            }
        })
    }
    const ip = addressFilter[0].address;
    console.log("Servidor ligado\n  ");
    console.log(`Acesse localhost:${port} no seu navegador`);
    console.log(`Acesse ${ip}:${port} no navegador do dispositivo que deseja conectar. \n Obs: Este dispositivo precisa estar conectado na mesma rede que você, seja ela wifi ou a cabo!`);

})