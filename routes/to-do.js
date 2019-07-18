const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
module.exports = router;

const getAllData = require('./tools').getAllData;
const populatePeopleDates = require('./tools').populatePeopleDates;

router.get('/checklist', showChecklist);

router.get('/to-do', showToDoList);
router.post('/to-do/new', newToDoItem);
router.post('/to-do/:id/edit', editToDoItem);

function showChecklist(req, res, next) {
  getAllData(data => {
    data.people = populatePeopleDates(data.people, data.events);

    data.personRef = {};
    data.people.forEach(person => data.personRef['' + person._id] = person);

    const anna = data.people.filter(person => person.name == 'Anna Peterson')[0];
    anna.connection = 'start';
    findAncestors(anna);

    function findAncestors(person) {
      (person.parents || []).forEach(parentId => {
        const parent = data.personRef['' + parentId];
        parent.connection = 'ancestor';
        findAncestors(parent);
        findDescendants(parent);
      });
    }

    function findDescendants(person) {
      (person.children || []).forEach(childId => {
        const child = data.personRef['' + childId];
        child.connection = child.connection || 'cousin';
        findDescendants(child);
      });
    }

    res.render('layout', {
      view: 'checklist',
      title: 'Checklist',
      ...data
    });
  });
}

function showToDoList(req, res, next) {
  mongoose.model('To-do').find({}, (err, todoItems) => {
    res.render('layout', {
      view: 'to-do',
      title: 'To-do List',
      todoItems: todoItems,
    });
  });
}

function newToDoItem(req, res, next) {
  const items = req.body.items.split('\n')
    .map(item => item.trim())
    .filter(item => item);

  const newTodo = {
    items: items,
  };

  mongoose.model('To-do').create(newTodo, (err, todo) => {
    if (err) {
      return res.send('There was a problem adding the information to the database.');
    }
    res.redirect('/to-do');
  });
}

function editToDoItem(req, res, next) {
  const todoId = req.params.id;

  const items = req.body.items.split('\n')
    .map(item => item.trim())
    .filter(item => item);

  const findTodo = {
    _id: todoId,
  };

  const updatedTodo = {
    items: items,
  };

  mongoose.model('To-do').update(findTodo, updatedTodo, err => {
    if (err) {
      return res.send('There was a problem updating the information to the database: ' + err);
    }

    res.redirect('/to-do');
  });
}
