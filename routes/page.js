const express = require('express');
const router = express.Router({mergeParams:true});
const fs = require('fs');
const makeTemplate = require('../lib/template.js');

router.get('/', function(req, res, next){
    const pageId = req.params.pageId;
    const fileArray = req.list;
    fs.readFile(`./data/${pageId}`, 'utf8', function(err, data){
        if(err) {
            next(err);
        } else {
            const title = pageId;
            const context = makeTemplate.body(title, data);
            const fileList = makeTemplate.fileList(fileArray);
            const template = makeTemplate.html(title, context, fileList, `<a href="/topic/create">create</a><a href="/topic/${title}/update">update</a><a href="/topic/${title}/delete">delete</a>`);
            res.send(template);   
        }   
    });   
});

router.get('/update', function(req, res){
    const updateId = req.params.pageId;
    const fileArray = req.list;
    fs.readFile(`data/${updateId}`, 'utf8', function(error, data){
        const title = 'Update';
        const form = `
        <form action="http://localhost:3000/topic/${updateId}/update" method="POST">
            <p><input type="text" name="title" value="${updateId}"></p>
            <p><textarea name="description">${data}</textarea></p>
            <p><input type="submit" value="OK"><p>
        </form>            
        `;
        const context = makeTemplate.body(title, form);
        const fileList = makeTemplate.fileList(fileArray);
        const template = makeTemplate.html(title, context, fileList, '');
        res.send(template); 
    });
});

router.post('/update', function(req, res){
    const updateId = req.params.pageId;
    const post = req.body;
    const title = post.title;
    const description = post.description;
    fs.rename(`./data/${updateId}`, `./data/${title}`, function(){
        fs.writeFile(`./data/${title}`, description, 'utf8', function(error){
            if(error) throw error;
            res.redirect(`/topic/${title}`);
        });
    });
});

router.get('/delete', function(req, res){
    const deleteId = req.params.pageId;
    console.log(deleteId);
    fs.unlink(`./data/${deleteId}`, function(error){
        res.redirect('/');
    });
});

module.exports = router;