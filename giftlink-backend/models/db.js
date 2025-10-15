// db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
    if (dbInstance){
        return dbInstance
    };

    const client = new MongoClient(url);
    
    try {
        await client.connect();
        dbInstance = client.db(dbname);

        await dbInstance.command({ ping: 1 });
        console.log("Connected successfully to MongoDB server");

        return dbInstance;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

module.exports = connectToDatabase;
