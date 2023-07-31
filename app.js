//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

const wikiSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const Articles = mongoose.model("Article", wikiSchema);

/////////////////////////////////// TARGETING ALL ARTICLES /////////////////////////////////// 

// Chaining Method
app.route("/articles")
    .get(function (req, res) {
        Articles.find({})
            .then(articles => {
                res.send(articles);
                // res.render("articles", {
                //     articles: articles
                // });
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .post(function (req, res) {
        console.log(req.body);
        const newArticle = new Articles({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save()
            .then(article => {
                res.status(201).send(article);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    })
    .delete(function (req, res) {
        Articles.deleteMany({})
            .then(() => {
                res.status(204).send("Deleted!");
            })
            .catch(err => {
                res.status(500).send(err);
            });
    });
// Is same as:

// app.get("/articles", function (req, res) {
//     Articles.find({})
//         .then(
//             articles => {
//                 res.send(articles);
//                 // res.render("articles", {
//                 //     articles: articles
//                 // });
//             }
//         )
//         .catch(err => {
//             res.status(500).send(err);
//         });

// });

// app.post("/articles", function (req, res) {
//     console.log(req.body);
//     const newArticle = new Articles({
//         title: req.body.title,
//         content: req.body.content
//     })
//     newArticle.save()
//         .then(article => {
//             res.status(201).send(article);
//         })
//         .catch(err => {
//             res.status(500).send(err);
//         });
// });

// app.delete("/articles", function (req, res) {
//     Articles.deleteMany({})
//         .then(() => {
//             res.status(204).send("Deleted!");
//         })
//         .catch(err => {
//             res.status(500).send(err);
//         });
// });

// Till Here...


/////////////////////////////////// TARGETING SPECIFIC ARTICLES /////////////////////////////////// 
app.route("/articles/:articleName")
    .get((req, res) => {

        Articles.findOne({ title: req.params.articleName })
            .then(article => {
                if (!article) {
                    res.status(404).send("Not Found");

                } else { res.send(article); };
            })
            .catch(err => { res.status(500).send(err); });
    })
    .put((req, res) => {
        Articles.replaceOne({ title: req.params.articleName }, { title: req.body.title, content: req.body.content })
            .then(article => {
                res.status(201).send(article);
            })
            .catch(err => { res.status(500).send(err); });
    })
    .patch((req, res) => {
        Articles.updateOne({ title: req.params.articleName }, req.body)
            .then(article => {
                res.status(201).send(article);
            })
            .catch(err => { res.status(500).send(err); });
    })
    .delete((req, res) => {
        Articles.deleteOne({ title: req.params.articleName })
            .then(() => {
                res.status(204).send("Deleted!");
            })
            .catch(err => { res.status(500).send(err); });
    });



app.listen(3000, function () {
    console.log("Server started on port 3000");
});