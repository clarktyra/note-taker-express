const express = require("express")
const path = require("path")
const app = express()
const PORT = process.env.PORT || 3000
const data = require("./db/db.json")
const { v4: uuidv4 } = require('uuid');
const util = require('util');
const fs = require('fs');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));

app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", "utf8", function (err, data) {
        res.json(JSON.parse(data).reverse())
    })
}
//res.json(data)
);

app.post('/api/notes', (req, res) => {
        console.log("req.body : ", req.body)
        const newNote = {
            title: req.body.title,
            text: req.body.text, 
            id: uuidv4()
        }
        console.log("newNote : ", newNote)
        //get the dbnotes
        // parse out array
        //push to array
        // stringify it
        //write to file with new array
        fs.readFile("./db/db.json", "utf8", function (err, data) {
            console.log("data: ", data)
            let parsedNotes;

            parsedNotes = JSON.parse(data)
            console.log("parsedNotes: ", parsedNotes)

            parsedNotes.push(newNote)
            console.log("parsedNotesAdded: ", parsedNotes)

            parsedNotes = JSON.stringify(parsedNotes);
            console.log("stringifiedParsedNotesAdded: ", parsedNotes)
            
            // return parsedNotes
            writeFileAsync('db/db.json', parsedNotes);
        })
        res.redirect("/")
        
    }
)

app.delete('/api/notes/:id', (req, res) => {
    fs.readFile("./db/db.json", "utf8", function (err, data) {
        console.log("data: ", data)
        let parsedNotes;

        parsedNotes = JSON.parse(data)
        console.log("parsedNotes: ", parsedNotes)

        parsedNotes = parsedNotes.filter(obj => obj.id != req.params.id)
        console.log("parsedNotesAdded: ", parsedNotes)

        parsedNotes = JSON.stringify(parsedNotes);
        console.log("stringifiedParsedNotesAdded: ", parsedNotes)
        
        // return parsedNotes
        writeFileAsync('db/db.json', parsedNotes);
    })
    res.redirect("/")
})

app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));

