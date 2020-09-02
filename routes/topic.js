const express = require('express');
const router = express.Router();
const fs = require('fs');
const makeTemplate = require('../lib/template.js');
const pageRouter = require('./page.js');

router.get('/create', function(req, res){
    const fileArray = req.list;
    const title = 'Create';
    const form = `
    <form action="http://localhost:3000/topic/create" method="POST">
        <p><input type="text" name="title" placeholder="title"></p>
        <p><textarea name="description" placeholder="description"></textarea></p>
        <p><input type="submit" value="OK"><p>
    </form>            
    `;
    const context = makeTemplate.body(title, form);
    const fileList = makeTemplate.fileList(fileArray);
    const template = makeTemplate.html(title, context, fileList, '');
    res.send(template);
});

router.post('/create', function(req, res){
    const post = req.body;
    const title = post.title;
    const description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(error){
        if(error) throw error;
        res.redirect(`/topic/${title}`);
    });
});

router.use('/:pageId', pageRouter);

module.exports = router;