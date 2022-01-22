const express = require('express');
const path = require('path');
const fs = require('fs');
// const database = require('./db/db.json');
const uuid = require('uuid');
// const api = require('public/assets/js/routes.js');
const app = express();
const PORT =  process.env.PORT || 3002;

//middleware//
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// app.use('/api', api);

//Setting up the URL routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname , "./public/notes.html"));
});
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./index.html"));
});

//Display 
app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        res.json(notes);
    })
});

//New Note
app.post("/api/notes", function(req, res) {
    // res.send('works')
    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newNote = req.body;
        newNote.id = uuid.v4();
        notes.push(newNote);

        const createNote = JSON.stringify(notes);
        fs.writeFile(path.join(__dirname, "./db/db.json"), createNote, (err) =>{
            if (err) throw err;
        });
        res.json(newNote);
    });
});

//Delete Saved Notes
app.delete("/api/notes/:id", function(req, res) {
    const noteID = req.params.id;
    fs.readFile(path.join(__dirname, "./db/db.json"), (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const notesArray = notes.filter(item => {
            return item.id !== noteID
        });
        fs.writeFile('./db/db.json', JSON.stringify(notesArray), (err, data) => {
            console.log("Delete")
            if (err) throw err; 
            res.json(notesArray) 

        });
    });

});

//--------------------------------------------------------------------------------------------------------

app.get('/', (req, res) => res.send('Navigate to /api/notes'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/api/notes.html'))
);



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

