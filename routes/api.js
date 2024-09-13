'use strict';
const Issue = require('../models/issue');

module.exports = function (app) {

  app.route('/api/issues/:project')
  
  app.get('/api/issues/:project', async (req, res) => {
    try {
      const project = req.params.project;
      const query = { project };
  

      for (const key in req.query) {
        if (req.query.hasOwnProperty(key)) {
          query[key] = req.query[key];
        }
      }
  
      const issues = await Issue.find(query);
      
      res.json(issues);
    } catch (err) {
      res.json({ error: 'Error fetching issues' });
    }
  });
  
    
  app.post('/api/issues/:project', async (req, res) => {
    let project = req.params.project; // Από το URL
    const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
  
    if (!issue_title || !issue_text || !created_by) {
      return res.json({ error: 'required field(s) missing' });
    }
  
    const newIssue = new Issue({
      project,  
      issue_title,
      issue_text,
      created_by,
      assigned_to: assigned_to || '',
      status_text: status_text || '',
      created_on: new Date(),
      updated_on: new Date(),
      open: true
    });
  
    try {
      const savedIssue = await newIssue.save();
      res.json({
        _id: savedIssue._id,
        issue_title: savedIssue.issue_title,
        issue_text: savedIssue.issue_text,
        created_by: savedIssue.created_by,
        assigned_to: savedIssue.assigned_to,
        status_text: savedIssue.status_text,
        created_on: savedIssue.created_on,
        updated_on: savedIssue.updated_on,
        open: savedIssue.open
      });
    } catch (err) {
      res.json({ error: 'Error saving issue' });
    }
  });
  
    
  app.put('/api/issues/:project', async (req, res) => {
    let project = req.params.project;
    const { _id, issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;

    if (!_id) return res.json({ error: 'missing _id' });
    if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open ) {
      res.json({ error: "no update field(s) sent", _id: _id });
      return;
    }

    try {
      const issueToUpdate = await Issue.findById(_id);
      if (!issueToUpdate) {
        return res.json({ error: 'could not update', _id:_id });
      }

      

      issueToUpdate.issue_title = issue_title || issueToUpdate.issue_title;
      issueToUpdate.issue_text = issue_text || issueToUpdate.issue_text;
      issueToUpdate.created_by = created_by || issueToUpdate.created_by;
      issueToUpdate.assigned_to = assigned_to || issueToUpdate.assigned_to;
      issueToUpdate.status_text = status_text || issueToUpdate.status_text;
      issueToUpdate.open = open !== undefined ? open : issueToUpdate.open;
      issueToUpdate.updated_on = new Date();

      const updatedIssue = await issueToUpdate.save();
      res.json({ result: 'successfully updated', _id:_id });
    } catch (err) {
      res.json({ error: 'could not update', _id:_id });
    }
    
  });
  app.delete('/api/issues/:project', async (req, res) => {
    let project = req.params.project;
    const { _id } = req.body;
  
    if (!_id) {
      return res.json({ error: 'missing _id'});
    }
  
    try {
      const issue = await Issue.findOneAndDelete({_id});
      if (!issue) {
        return res.json({ error: 'could not delete', _id:_id });
      }
      res.json({ result: 'successfully deleted', _id:_id });
    } catch (err) {
      res.json({ error: 'could not delete', _id:_id });
    }
  });
  
  
};
