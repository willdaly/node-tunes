'use strict';

var multiparty = require('multiparty');
var artists = global.nss.db.collection('artists');
// var Mongo = require('mongodb');
var fs = require('fs');
var mkdirp = require('mkdirp');

exports.index = (req, res)=>{
  artists.find().toArray((err,records)=>{
    res.render('artists/index', {artists: records, title: 'artist list'});
  });
};

 exports.new = (req, res) => {
   res.render('artists/new', {title: 'new artist'});
 };

 exports.create = (req, res) => {
    var form = new multiparty.Form();
    form.parse(req, (err, field, file)=>{
      var artist = {};
      artist.name = field.name[0];
      artist.art = file.art[0].originalFilename;
      mkdirp(`${__dirname}/../static/img/${artist.name}`, function(err){
        fs.renameSync(file.art[0].path, `${__dirname}/../static/img/${artist.name}/${artist.art}`);
      });
      artists.save(artist, ()=>res.redirect('/artists'));
      });
 };
