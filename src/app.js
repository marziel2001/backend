const express = require("express");
const cors = require("cors");

const { MongoClient } = require("mongodb");

const app = express();
app.use(
  cors({
    origin: "*", // pozwól wszystkim domenom
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);
const serverPort = 3000;
const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

let peopleCollecion; // referencja do kolekcji

async function startServer() {
  try {
    // najpierw łączymy się z bazą
    await client.connect();
    const db = client.db("test");
    peopleCollection = db.collection("ludzie");
    photoCollection = db.collection("zdjecia1");
    console.log("Połączono z MongoDB");

    // dopiero potem odpalamy Expressa
    app.listen(serverPort, () => {
      console.log(`Serwer działa na http://localhost:${serverPort}`);
    });
  } catch (err) {
    console.error("Błąd podczas startu:", err);
    process.exit(1); // zamykamy proces jeśli nie udało się połączyć
  }
}

app.get("/items", async (req, res) => {
  try {
    if (!peopleCollecion) {
      return res.status(500).send("Brak połączenia z MongoDB");
    }

    const items = await peopleCollecion.find().toArray();
    res.json(items);
  } catch (err) {
    console.error("Błąd w /items:", err.message);
    res.status(500).send("Błąd serwera: " + err.message);
  }
});

app.get("/photos", async (req, res) => {
  try {
    const photos = await photoCollection.find().toArray();
    res.json(photos);
  } catch (err) {
    res.status(500).send("Błąd serwera");
  }
});

// uruchamiamy
startServer();
