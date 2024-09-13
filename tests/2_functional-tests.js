const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let issuetest1;
let issuetest2;
suite('Functional Tests', function() {
    suite("Post Tests", function () {
        test('Create an issue with every field', function(done) {
            chai.request(server)
              .post('/api/issues/firstProject')
              .send({
                issue_title: 'First test (All Fields)',
                issue_text: 'Example 1 first test.',
                created_by: 'John',
                assigned_to: 'George',
                status_text: 'Solved'
            }) 
            .end(function(err, res) {
                issuetest1=res.body;
                assert.equal(res.status, 200);
                assert.property(res.body, '_id');
                assert.equal(res.body.issue_title, 'First test (All Fields)');
                assert.equal(res.body.issue_text, 'Example 1 first test.');
                assert.equal(res.body.created_by, 'John');
                assert.equal(res.body.assigned_to, 'George');
                assert.equal(res.body.status_text, 'Solved');    
                done();        
            });
        });
        test('Create an issue with only required fields', function(done) {
            chai.request(server)
              .post('/api/issues/secProject')
              .send({
                issue_title: 'Only Required Fields',
                issue_text: 'Example 2 Only Required.',
                created_by: 'John'
              })
              .end(function(err, res) {
                issuetest2=res.body;
                assert.equal(res.status, 200);
                assert.property(res.body, '_id');               
                assert.equal(res.body.issue_title, 'Only Required Fields');
                assert.equal(res.body.issue_text, 'Example 2 Only Required.');
                assert.equal(res.body.created_by, 'John');
                assert.equal(res.body.assigned_to, '');
                assert.equal(res.body.status_text, '');
                done();
              });
        });
        test('Create an issue with missing required fields', function(done) {
            chai.request(server)
              .post('/api/issues/firstProject')
              .send({
                issue_title: "3rd test with missing fields",
                issue_text: "",
                created_by: "",
                assigned_to: "",
                status_text: "",
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "required field(s) missing");
                done();
              });
        });
    });
    suite("Get Tests", function () {
        test("View issues on a project", function (done) {
            chai
              .request(server)
              .get("/api/issues/firstProject")
              .end(function (err, res) {
                // console.log(res.body);
                assert.equal(res.status, 200);
                assert.isArray(res.body, 'Response should be an array'); 
                assert.property(res.body[0], '_id');
                done();
              });
        });
        test("View issues on a project with one filter", function (done) {
            chai
                .request(server)
                .get("/api/issues/apitest")
                .query({
                    _id: "66e445b009371c45a9f353b6",
                })
                
                .end(function (err, res) {
                    
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body[0], {
                        _id: "66e445b009371c45a9f353b6",
                        project:"apitest",
                        issue_title: "newtitle",
                        issue_text: "newtext",
                        created_on: new Date('2024-09-13T14:01:20.126Z').toISOString(),
                        updated_on: new Date('2024-09-13T14:01:20.126Z').toISOString(),
                        created_by: "newcreator",
                        assigned_to: "",
                        open: true,
                        status_text: "",
                        __v:0
                    });
                done();
                });
        });
        test("View issues on a project with multiple filters", function (done) {
            chai
                .request(server)
                .get("/api/issues/apitest")
                .query({
                    issue_title: "newtitle",
                    issue_text: "newtext",
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body[0], {
                        _id: "66e445b009371c45a9f353b6",
                        project:"apitest",
                        issue_title: "newtitle",
                        issue_text: "newtext",
                        created_on: new Date('2024-09-13T14:01:20.126Z').toISOString(),
                        updated_on: new Date('2024-09-13T14:01:20.126Z').toISOString(),
                        created_by: "newcreator",
                        assigned_to: "",
                        open: true,
                        status_text: "",
                        __v:0
                    });    
                    done();
                });
        });
    });

    suite("Put Tests", function () {
        test("Update one field on an issue", function (done) {
            chai
              .request(server)
              .put("/api/issues/apitest")
              .send({
                _id: issuetest1._id,
                issue_title: "new3",
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body._id, issuetest1._id);
                assert.equal(res.body.result, "successfully updated");
                done();
              });
        });
        test("Update multiple fields on an issue", function (done) {
            chai
              .request(server)
              .put("/api/issues/firstProject")
              .send({
                _id: issuetest1._id,
                issue_title: "updated",
                created_by: "updated user",
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, "successfully updated");
                assert.equal(res.body._id, issuetest1._id);
    
                done();
              });
        });
        test("Update an issue with missing _id", function (done) {
            chai
              .request(server)
              .put("/api/issues/firstProject")
              .send({
                issue_title: "updated with missing _id",
                issue_text: "updated with missing _id",
                created_by: "updated user",
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "missing _id");    
                done();
              });
        });
        test("Update an issue with no fields to update", function (done) {
            chai
              .request(server)
              .put("/api/issues/firstProject")
              .send({
                _id: issuetest1._id,
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "no update field(s) sent");    
                done();
              });
        });
        test("Update an issue with an invalid _id", function (done) {
            chai
              .request(server)
              .put("/api/issues/firstProject")
              .send({
                _id: "122313131",
                issue_title: "updated title",
                 
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "could not update");    
                done();
              });
        });
    });
    let testid;
    suite("Delete Tests", function () {
        test("Delete an issue", function (done) {
            chai
              .request(server)
              .delete("/api/issues/firstProject")
              .send({
                _id: issuetest1._id,
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, "successfully deleted");    
                done();
              });
        });
        test("Delete an issue with an invalid _id", function (done) {
            chai
              .request(server)
              .delete("/api/issues/secProject")
              .send({
                _id: "111111111111",
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "could not delete");    
                done();
              });
        });
        test("Delete an issue with missing _id", function (done) {
            chai
              .request(server)
              .delete("/api/issues/firstProject")
              .send({})
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "missing _id");    
                done();
              });
        });
    });
});
