import * as express from "express";
import { connection } from "./connection";
import * as mongojs from "mongojs";
import { checkJwt } from "../helpers/authorization-helper";


const router = express.Router();

//get all filter by
router.get("/api/:collection", function (req, res) {
    req.query.multi = req.query.multi !== "false";

    const db = connection(req.params.collection);
    const action = req.query.multi ? "find" : "findOne";

    db[req.params.collection][action](
        req.query.filter ? JSON.parse(req.query.filter) : {},
        (err, result) => {
            if (err) { res.send(err); }
            res.json(result);
        });
});

//get by id
router.get("/api/:collection/:id", function (req, res) {
    const db = connection(req.params.collection);
    db[req.params.collection].findOne(
        { _id: mongojs.ObjectId(req.params.id) },
        function (err, result) {
            if (err) { res.send(err); }
            res.json(result);
        });
});

//insert
router.post("/api/:collection", function (req, res) {
    delete req.body._id;
    const db = connection(req.params.collection);
    db[req.params.collection].insert(
        req.body,
        function (err, result) {
            if (err) { res.send(err); }
            res.json(result);
        });
});

//update all by filter
router.put("/api/:collection", function (req, res) {
    delete req.body._id;
    const db = connection(req.params.collection);
    db[req.params.collection].update(
        req.query.filter ? JSON.parse(req.query.filter) : {},
        { $set: req.body },
        { multi: true },
        function (err, result) {
            if (err) { res.send(err); }
            res.json(result);
        });
});

//update by id
router.put("/api/:collection/:id", function (req, res) {
    delete req.body._id;
    const db = connection(req.params.collection);
    db[req.params.collection].update(
        { _id: mongojs.ObjectId(req.params.id) },
        req.body,
        function (err, result) {
            if (err) { res.send(err); }
            res.json(result);
        });
});

//delete all by filter
router.delete("/api/:collection", function (req, res) {
    const db = connection(req.params.collection);
    db[req.params.collection].remove(
        req.query.filter ? JSON.parse(req.query.filter) : {},
        function (err, result) {
            if (err) { res.send(err); }
            res.json(result);
        });
});

//delete by id
router.delete("/api/:collection/:id", function (req, res) {
    const db = connection(req.params.collection);
    db[req.params.collection].remove(
        { _id: mongojs.ObjectId(req.params.id) },
        function (err, result) {
            if (err) { res.send(err); }
            res.json(result);
        });
});

module.exports = router;