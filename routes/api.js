/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app, Books) {

  app.route('/api/books')
    .get(function (req, res){
      Books.find({}, function(err, documents){
        if(err){
          console.log(err);
        }else{
          res.json(documents);
        };
      });
    })
    
    .post(function (req, res){
      let document = new Books({title: req.body.title});
      
      document.save(function(err, document){
        if(err){
          console.log(err);
        }else{
          res.json({title: document.title, _id: document._id});
        };
      });
    })
    
    .delete(function(req, res){
      Books.remove({}, function(err, document){
        if(err || !document){
          console.log(err);
        }else{
          res.send("complete delete successful");
        };
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
       Books.findById(req.params.id, function(err, document){
        if(err || !document){
          res.send("no book exists");
        }else{
          res.json(document);
        };
       });
    })
    
    .post(function(req, res){
      Books.findByIdAndUpdate(req.params.id, {$push: {comments: req.body.comment}}, {new: true}, function(err, document){
        if(err || !document){
          res.send("no book exists");
        }else{
          res.json(document);
        };
      });
    })
    
    .delete(function(req, res){
      Books.findByIdAndRemove(req.params.id, function(err, document){
        if(err || !document){
          res.send("no book exists");
        }else{
          res.send("delete successful");
        };
      });
    });
  
};
