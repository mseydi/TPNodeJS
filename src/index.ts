import  express from  "express";
import mongoose from "mongoose"
import bodyParser from "body-parser";
import Book from "./book";


const app=express();
/*Middlewer pour parserles objet json*/
app.use(bodyParser.json());

app.get("/", (req,resp)=>{
    resp.send("Hello Express");
});
/*Connection ) MongoDB*/
const uri:string="mongodb://localhost:27017/BIBLIO";
mongoose.connect(uri,(err)=>{
    if(err){console.log(err);
    }else{
        console.log("Mongo db connected sucess");
    }
});

/*Requete HTTP GET http:localhost:8085/books*/
app.get("/books", (req,resp)=>{
   Book.find((err,books)=>{
       if(err){
           resp.status(500).send(err);
       }else {
           resp.send(books);
       }
   });
});

/*Requete HTTP GET http:localhost:8085/books/id*/
app.get("/books/:id", (req,resp)=>{
    Book.findById(req.params.id,(err,book)=>{
        if(err){
            resp.status(500).send(err);
        }else {
            resp.send(book);
        }
    });
});

/*Requete HTTP update*/
app.put("/books/:id", (req,resp)=>{
    Book.findByIdAndUpdate(req.params.id,req.body,(err)=>{
        if(err){
            resp.status(500).send(err);
        }else {
            resp.send("Successfuly update book");
        }
    });
});

/*Requete HTTP delete*/
app.delete("/books/:id", (req,resp)=>{
    Book.deleteOne({_id:req.params.id},(err)=>{
        if(err){
            resp.status(500).send(err);
        }else {
            resp.send("Successfuly deled book");
        }
    });
});


/*Requete HTTP POST http:localhost:8085/books*/
app.post("/books", (req,resp)=>{
    let book =new Book(req.body);
    book.save(err=>{
        if(err) resp.status(500).send(err);
        else resp.send(book);
    })
});

/*REquete pagination*/
app.get("/pbooks",(req,resp)=>{
    let p:number=parseInt(req.query.page || 1);
    let size:number=parseInt(req.query.size || 5);
    Book.paginate({}, {page: p, limit: size}, (err, result)=>{
        if(err) resp.status(500).send(err);
        else resp.send(result);
    });
});

/* Requête HTTP GET http://localhost:8700/books-serach?kw=J&page=0&size=5 */
app.get("/books-serach",(req,resp)=>{
    let p:number=parseInt(req.query.page || 1);
    let size:number=parseInt(req.query.size || 5);
    let keyword:string=req.query.kw || '';
    Book.paginate({title:{$regex:".*(?i)"+keyword+".*"}}, { page: p, limit:
    size }, function(err, result) {
        if(err) resp.status(500).send(err);
        else resp.send(result);
    });
});

app.listen(8085,()=>{
    console.log("server started");
});