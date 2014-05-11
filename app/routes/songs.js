'use strict';
var albums = global.nss.db.collection('albums');
var artists = global.nss.db.collection('artists');
var songs = global.nss.db.collection('songs');
var multiparty = require('multiparty');
var fs = require('fs');
var mkdirp = require('mkdirp');
// var _ = require('lodash');

exports.index = (req, res)=>{
  artists.find().toArray((err, artsts)=>{
    albums.find().toArray((err, albms)=>{
      songs.find(req.query).toArray((err, sngs)=>{
    //   sngs = sngs.map(s =>{
    //     var al = _(albms).find(a => a._id.toString() === s.albumId.toString());
    //     var ar = _(artsts).find(a=>a._id.toString() === s.artistId.toString());
    //     s.album = al;
    //     s.artist = ar;
    //     return s;
    // });
    res.render('songs/index', {songs: sngs, artists: artsts, albums: albms, title: 'songs'});
});
});
});

};

exports.new = (req, res) => {
  artists.find().toArray((err, artsts)=>{
    albums.find().toArray((err,albms)=>{
      res.render('songs/new', {artists: artsts, albums: albms, title: 'new song'});
    });
  });
};

exports.create = (req, res) => {
  var form = new multiparty.Form();
  form.parse(req,(err, field, file)=>{
    var song = {};
    song.name = field.name[0];
    song.genre = field.genre[0];
    song.song = file.mp3[0].originalFilename;
    mkdirp(`${__dirname}/../static/audios/${song.name}`, function(err){
      fs.renameSync(file.mp3[0].path,`${__dirname}/../static/audios/${song.name}/${song.song}`);
    });
    songs.save(song, ()=>res.redirect('/songs'));
  });
};
