const express = require('express')
const axios = require('axios')

const config = require('./config')
const firebase = require('./db')
const firestore = firebase.firestore()

const app = express()

const PORT = process.env.PORT || config.port

app.listen(PORT, () => console.log(`server running on port ${PORT}`)) 

var options = {
    method: 'GET',
    url: 'https://api-imoveis-locacao.p.rapidapi.com/conceito',
    headers: {
        'x-rapidapi-host': config.rapid_api_host,
        'x-rapidapi-key': config.rapid_api_key
    }
};

app.get('/busca', (req, res) => {
    axios.request(options)
        .then(function(response) {
            imoveis = response.data
            var batch = firestore.batch()
            imoveis.forEach(imovel => {
                var imovRef = firestore.collection('imoveis').doc()
                batch.set(imovRef,imovel)
            })
            console.log('Imóveis: ', imoveis.length)
            batch.commit()
            res.json(imoveis)
        })
        .catch(function(error) {
            console.error(error)
        })
})

app.get('/db', (req, res) => {
    var imoveis = []
    const db = firestore.collection('imoveis')
    const doc = db.get()
        .then((snapshot)=> {
            snapshot.forEach(doc => {
                imoveis.push(doc.data())
            })
            console.log('Na base: ', imoveis.length)
            res.json( imoveis)

        })
})


