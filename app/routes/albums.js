'use strict';

var multiparty = require('multiparty');
var albums = global.nss.db.collection('albums');
// var Mongo = require('mongodb');
var fs = require('fs');
var mkdirp = require('mkdirp');

exports.index = (req, res)=>{
  albums.find().toArray((err,records)=>{
    res.render('albums/index', {albums: records, title: 'album list'});
  });
};

 exports.new = (req, res) => {
   res.render('albums/new', {title: 'new album'});
 };

 exports.create = (req, res) => {
    var form = new multiparty.Form();
    form.parse(req, (err, field, file)=>{
      var album = {};
      album.name = field.name[0];
      album.art = file.art[0].originalFilename;
      mkdirp(`${__dirname}/../static/img/${album.name}`, function(err){
        fs.renameSync(file.art[0].path, `${__dirname}/../static/img/${album.name}/${album.art}`);
      });
      albums.save(album, ()=>res.redirect('/albums'));
      });
 };
