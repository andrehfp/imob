const express = require('express')
const axios = require('axios')

const config = require('./config')
const firebase = require('./db')
const firestore = firebase.firestore()

const app = express()

const PORT = process.env.PORT || config.port

app.listen(PORT, () => console.log(`server running on port ${PORT}`)) 






