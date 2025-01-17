import { MongoClient } from "mongodb";
import { config } from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config();

const uri = process.env.DB_URI;
const client = new MongoClient(uri);

client.connect();

const db = client.db("nish-tasks");
const coll = db.collection("tasks");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/create", (req, res) => {
  console.log("POST");
  try {
    const document = req.body;
    coll.insertOne(document);
    res.write("SUCCESS...");
  } catch (error) {
    res.write("ERROR : ");
    res.write(JSON.stringify(error));
  } finally {
    res.end();
  }
});

app.get("/all_records", (req, res) => {
  const docs = coll.find().toArray();
  docs
    .then((doc) => {
      res.write(JSON.stringify(doc));
      res.end();
    })
    .catch((err) => {
      res.write(err);
      res.end();
    });
});

app.get("/",(req,res) => {
  res.sendFile(path.join(__dirname,"index.html"));
})

app.listen(3000);
