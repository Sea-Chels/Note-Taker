const express = require('express');
const path = require('path');
const fs = require('fs');
const db = './db/db.json';
const uuid = require('uuid');


const app = express();
const PORT =  process.env.PORT || 3002;

//middleware//
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//-----------routes-------------------
app.get("/notes", (req, res)=>{
    res.sendFile(path.join(__dirname , "./public/notes.html"));
});
app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "./index.html"));
});

//setting up getpostdelete routes --------------------------------
app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, db), (err, data) => {
        if (err) console.log(`GET Error: ${err}`);
        const notes = JSON.parse(data);
        res.json(notes);
    })
});

app.post("/api/notes", (req, res)=>{
    // res.send('this route works')
    fs.readFile(path.join(__dirname, db), (err, data) => {
        if (err) console.log(`1 POST Error: ${err}`);
        const notes = JSON.parse(data);
        const newNote = req.body;
        newNote.id = uuid.v4();
        notes.push(newNote);
        const newNotesList = JSON.stringify(notes);

        fs.writeFile(path.join(__dirname, db), newNotesList, (err) =>{
            if (err) console.log(`2 POST Error: ${err}`);
        });
        res.json(newNote);
    });
});

app.delete("/api/notes/:id", (req, res)=>{
//     console.log(`attempting to delete`)
    const noteID = req.params.id;
    fs.readFile(path.join(__dirname, db), (err, data) => {
        if (err) console.log(`1 DELETE Error: ${err}`);
        const notes = JSON.parse(data);
        const notesList = notes.filter((remainingNotes) => {
            return remainingNotes.id !== noteID
        });
        fs.writeFile(db, JSON.stringify(notesList), (err, data) => {
            console.log("Deleted note successfully!")
            if (err) console.log(`2 DELETE Error: ${err}`); 
            res.json(notesList) 

        });
    });

});

app.listen(PORT, () =>
  console.log(`App listening at port ${PORT}`)
);

