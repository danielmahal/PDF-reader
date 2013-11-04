var PFParser = require('pdf2json/pdfparser'),
    qs = require('querystring'),
    express = require('express');

var app = express();

app.use(express.static('public'));

app.get('/pdf/:file', function(req, res){
    var parser = new PFParser();

    parser.on('pdfParser_dataReady', function(data) {
        var body = '';

        data.PDFJS.pages.forEach(function(page) {
            page.Texts.forEach(function(line) {
                line.R.forEach(function(text) {
                    body += qs.unescape(text.T);
                });
            });
        });

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Length', body.length);
        res.end(body);
    });

    parser.on('pdfParser_dataError', function(err) {
        console.error(err);
    });

    parser.loadPDF('./data/' + req.params.file);
});

app.listen(3000);
console.log('Listening on port 3000');
