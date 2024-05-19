import { MongoClient } from 'mongodb';



const credentialsSchema = new MongoClient.Schema({
    uid: {
        type: String,
        required: true
    },
    doc_id: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    app_key: {
        type: String,
        required: true
    },
    app_secret: {
        type: String,
        required: true
    },

    app_email: {
        type: String,
        required: true
    }
});

const Credentials = MongoClient.model('credentials', credentialsSchema);

export default Credentials;