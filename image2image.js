const port = 3000;

const express = require('express');
const axios = require('axios');
const app = express();

const process = require("process");

const multer = require('multer');
const upload = multer();

const FormData = require("form-data");
const concat = require("concat-stream")

process.on('SIGINT', function() {
  process.exit(0);
});

// Serve the index.html file
app.use(express.static('static'));

// Read uploaded file and transparently forward to Dezgo API, then return the resulting image
app.post('/api', upload.single('file'), (req, res) => {

  let formData = new FormData();
  formData.append('init_image', req.file.buffer, "file.png");
  formData.append('prompt', 'an astronaut riding a horse, digital art, highly-detailed masterpiece trending HQ');
  formData.append('strength', '0.9')

  formData.pipe(concat({encoding: 'buffer'}, buf => {
  
    const options = {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': 'API_KEY_HERE',
        'X-RapidAPI-Host': 'dezgo.p.rapidapi.com',
        ...formData.getHeaders()
      },
      data: buf,
      url: 'https://dezgo.p.rapidapi.com/image2image',
      responseType: "arraybuffer"
    };
  
    axios.request(options)
      .then(response => {
        res.status(response.status).set("Content-Type", "image/png").send(response.data);
      })
      .catch(error => {
        console.log(error);
        res.status(error.response.status).send(error.response.data);
      });
  
  
  }))
});

app.listen(port, () => {
  console.log(`Server started`);
});


