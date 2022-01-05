const dotenv = require('dotenv')
const assert = require('assert')

dotenv.config()

const {
    PORT,
    RAPID_API_HOST,
    RAPID_API_KEY,
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID
} = process.env
    
assert(PORT, 'PORT is required')

module.exports = {
    port: PORT,
    rapid_api_host:RAPID_API_HOST,
    rapid_api_key:RAPID_API_KEY,
    firebaseConfig: {
        apiKey:API_KEY,
        authDomain:AUTH_DOMAIN,
        projectId:PROJECT_ID,
        storageBucket:STORAGE_BUCKET,
        messagingSenderId:MESSAGING_SENDER_ID,
        appId:APP_ID
    }
}
