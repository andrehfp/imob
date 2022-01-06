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

app.get('/add', (req, res) => {
    var imoveis = []
    var existentes = []
    var novos = []
    var promises = []
    const db = firestore.collection('imoveis')
    axios.request(options)
        .then(function(response) {
            imoveis = response.data
            var batch = firestore.batch()
            imoveis.forEach(imovel => {
                promises.push(
                    db.doc(imovel.uid).get()
                    .then(doc => {
                        if (doc.exists) existentes.push(imovel) 
                        else {
                            novos.push(imovel)
                            var imovRef = firestore.collection('imoveis').doc(imovel.uid)
                            batch.set(imovRef,imovel)
                        }
                    }).catch(error => {
                        console.log(error)
                    })
                )
            })
            Promise.all(promises)
                .then((ok) => {
                    res.json(imoveis)
                    batch.commit()
                    console.log('Imóveis da API: ', imoveis.length)
                    console.log('Existentes: ', existentes.length)
                    console.log('Novos: ', novos.length)
                })
                .then(()=> {
                    addNew(novos)
                })
                .catch(error => {
                    console.log(error)
                })
        })
        .catch(function(error) {
            console.error(error)
        })
})

function addNew(novos){
    console.log('novos imóveis para cadastro: ', novos.length)
    db = firestore.collection('novos')
    var batch = firestore.batch()
    novos.forEach(imovel => {
        imovel.createdAt = Date.now()
        var imovRef = firestore.collection('novos').doc(imovel.uid)
        batch.set(imovRef, imovel)
    })
    batch.commit()
}


app.get('/db', (req, res) => {
    var imoveis = []
    const db = firestore.collection('imoveis')
    const doc = db.get()
        .then((snapshot)=> {
            snapshot.forEach(doc => {
                imoveis.push(doc.data())
            })
            console.log('Na base: ', imoveis.length)
            res.json(imoveis)
        })
})

app.get('/novos', (req, res) => {
    var imoveis = []
    
    const db = firestore.collection('novos')
    const doc = db.get()
        .then((snapshot) => {
            snapshot.forEach(doc => {
                imoveis.push(doc.data())
            })
        })
        .then(() => {
            res.json(imoveis)
        })
        .catch( err => {
            console.log(err)    
        })

})

app.get('/', (req, res) => {
    res.json('Bem-vindo ao app Imob!')
})
