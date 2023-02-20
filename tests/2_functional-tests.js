/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        let response = JSON.parse(res.text)
        assert.equal(res.status, 200);
        assert.isArray(response, 'response should be an array');
        assert.property(response[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(response[0], 'title', 'Books in array should contain title');
        assert.property(response[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .post("/api/books")
          .send({title: "Livro teste"})
          .end(function(err, res){
            let response = JSON.parse(res.text);
            assert.equal(res.status, 200);
            assert.typeOf(response, "object")
            assert.property(response, "title");
            assert.property(response, "_id");
            done();
          });
      });

      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post("/api/books")
          .send({})
          .end(function(err, res){
            let response = res.text;
            assert.typeOf(response, "string");
            assert.equal(response, "missing required field title");
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .get("/api/books")
          .end(function(err, res){
            let response = JSON.parse(res.text)
            assert.typeOf(response, "array");
            response.forEach(function(element){
              assert.typeOf(element, "object")
              assert.property(element, "commentcount");
              assert.property(element, "title");
              assert.property(element, "_id");
            });
            done()
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .get("/api/books/iij")
          .end(function(err, res){
              let response = res.text;
              assert.typeOf(response, "string")
              assert.equal(response, "no book exists")
              done()
            });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai
          .request(server)
          .post("/api/books")
          .send({title: "Get test"})
          .end(function(err, res){
            let id = JSON.parse(res.text)._id
            chai
              .request(server)
              .get("/api/books/"  + id)
              .end(function(err, res){
                let response = JSON.parse(res.text);
                assert.typeOf(response, "object");
                assert.property(response, "commentcount");
                assert.property(response, "title");
                assert.property(response, "_id");
                assert.property(response, "comments");
                done()
              })
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
          .request(server)
          .post("/api/books")
          .send({title: "Update test"})
          .end(function(err, res){
            let id = JSON.parse(res.text)._id
            chai
              .request(server)
              .post("/api/books/"  + id)
              .send({comment: "Test comment"})
              .end(function(err, res){
                let response = JSON.parse(res.text);
                assert.typeOf(response, "object");
                assert.property(response, "commentcount");
                assert.property(response, "title");
                assert.property(response, "_id");
                assert.property(response, "comments");
                assert.include(response.comments, "Test comment");
                done();
              });
        });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
          .request(server)
          .post("/api/books/test")
          .send({})
          .end(function(err, res){
            let response = res.text;
            assert.typeOf(response, "string");
            assert.equal(response, "missing required field comment");
            done();
          });          
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
          .request(server)
          .post("/api/books/test")
          .send({comment: "Test comment"})
          .end(function(err, res){
            let response = res.text;
            assert.typeOf(response, "string");
            assert.equal(response, "no book exists");
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .post("/api/books")
          .send({title: "Delete test"})
          .end(function(err, res){
            let id = JSON.parse(res.text)._id
            chai
              .request(server)
              .delete("/api/books/"  + id)
              .end(function(err, res){
                let response = res.text;
                assert.typeOf(response, "string");
                assert.equal(response, "delete successful")
                done();
              });
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
        .request(server)
        .delete("/api/books/test")
        .end(function(err, res){
          let response = res.text;
          assert.typeOf(response, "string");
          assert.equal(response, "no book exists")
          done();
        });       
      });

    });

  });

});
