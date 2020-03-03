const path = require('path');
const express = require('express');
const xss = require('xss');

const NotesService = require('./notes-service');

const notesRouter = express.Router();
const jsonParser = express.json();

const serializeNote = note => ({
  id: note.id,
  note_name: xss(note.note_name),
  content: xss(note.content),
  date_modified: note.date_modified,
  folder_id: note.folder_id
});


notesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    NotesService.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes.map(serializeNote));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { note_name, content, folder_id } = req.body;
    const newNote = { note_name, content };

    for (const [key, value] of Object.entries(newNote)) {
      if (value == null) { // eslint-disable-line eqeqeq
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body`}
        });
      }
    }

    newNote.folder_id = folder_id;

    NotesService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${note.id}`))
          .json(serializeNote(note));
      })
      .catch(next);
  });