"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const book_1 = __importDefault(require("./book"));
const app = express_1.default();
/*Middlewer pour parserles objet json*/
app.use(body_parser_1.default.json());
app.get("/", (req, resp) => {
    resp.send("Hello Express");
});
/*Connection ) MongoDB*/
const uri = "mongodb://localhost:27017/BIBLIO";
mongoose_1.default.connect(uri, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Mongo db connected sucess");
    }
});
/*Requete HTTP GET http:localhost:8085/books*/
app.get("/books", (req, resp) => {
    book_1.default.find((err, books) => {
        if (err) {
            resp.status(500).send(err);
        }
        else {
            resp.send(books);
        }
    });
});
/*Requete HTTP GET http:localhost:8085/books/id*/
app.get("/books/:id", (req, resp) => {
    book_1.default.findById(req.params.id, (err, book) => {
        if (err) {
            resp.status(500).send(err);
        }
        else {
            resp.send(book);
        }
    });
});
/*Requete HTTP update*/
app.put("/books/:id", (req, resp) => {
    book_1.default.findByIdAndUpdate(req.params.id, req.body, (err) => {
        if (err) {
            resp.status(500).send(err);
        }
        else {
            resp.send("Successfuly update book");
        }
    });
});
/*Requete HTTP delete*/
app.delete("/books/:id", (req, resp) => {
    book_1.default.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            resp.status(500).send(err);
        }
        else {
            resp.send("Successfuly deled book");
        }
    });
});
/*Requete HTTP POST http:localhost:8085/books*/
app.post("/books", (req, resp) => {
    let book = new book_1.default(req.body);
    book.save(err => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(book);
    });
});
/*REquete pagination*/
app.get("/pbooks", (req, resp) => {
    let p = parseInt(req.query.page || 1);
    let size = parseInt(req.query.size || 5);
    book_1.default.paginate({}, { page: p, limit: size }, (err, result) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(result);
    });
});
/* Requête HTTP GET http://localhost:8700/books-serach?kw=J&page=0&size=5 */
app.get("/books-serach", (req, resp) => {
    let p = parseInt(req.query.page || 1);
    let size = parseInt(req.query.size || 5);
    let keyword = req.query.kw || '';
    book_1.default.paginate({ title: { $regex: ".*(?i)" + keyword + ".*" } }, { page: p, limit: size }, function (err, result) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(result);
    });
});
app.listen(8085, () => {
    console.log("server started");
});
