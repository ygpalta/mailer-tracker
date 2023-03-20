const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

const settingsSchema = new mongoose.Schema(
    {
        "clientName": {
            "type": "String"
        },
        "smtp_setup": {
            "host": {
                "type": "String"
            },
            "port": {
                "type": "Number"
            },
            "tls": {
                "type": "Boolean",
                "default": "false"
            },
            "authentication": {
                "type": "Boolean",
                "default": "false"
            },
            "userName": {
                "type": "String"
            },
            "password": {
                "type": "String"
            },
        },
        "total_sent": {
            "type": "Number",
            "default" : 0,
        },
        "total_clicked": {
            "type": "Number",
            "default": 0,
        },
        "total_trained": {
            "type": "Number",
            "default": 0,
        },
        "poweredby": {
            "type": "String",
            "default": "Apptriangle",
        }
    }
);

var Settings = mongoose.model('Settings', settingsSchema);

async function resetSettings() {
    const updatedSettings = await Settings.findOneAndUpdate({ poweredby: "Apptriangle", },
        {
            clientName: "",
            smtp_setup: {
                host: "127.0.0.1",
                port: 8080,
                tls: false,
                authentication: false,
                userName: '',
                password: ''
            },
            poweredby: "Apptriangle",
            total_sent: 0,
            total_clicked:0,
            total_trained:0,
        }, {
            upsert: true
        }
        );
    return updatedSettings;
}

mongoose.connection.once('open', () => {
    console.log('Mongo DB Connection Ready');
});

mongoose.connection.on('error', (err) => {
    console.error(err);
});


async function mongoConnect() {
    console.log("C0nnecting");
    await mongoose.connect(MONGO_URL);
    console.log("Connected");
};

async function mongoDisconnect() {
    await mongoose.disconnect();
}
async function resetDB() {
    await mongoConnect();
    await resetSettings();
    await mongoDisconnect();
}
resetDB();

