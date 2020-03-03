const path = require('path');
const express = require('express');
const xss = require('xss');

const FoldersService = require('./folders-service');

const foldersRouter = express.Router();
const jsonParser = express.json();

const serializeFolder = folder => ({
  id: folder.id,
  folder_name: xss(folder.folder_name)
});

foldersRouter
  .route('/')
  .get((req, res, next) => {
    FoldersService.getAllFolders(req.app.get('db'))
      .then(folders => {
        res.json(folders.map(serializeFolder));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { folder_name } = req.body;
    const newFolder = { folder_name };

    for (const [key, value] of Object.entries(newFolder)) {
      if (value == null) { // eslint-disable-line eqeqeq
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body`}
        });
      }
    }

    FoldersService.insertUser(
      req.app.get('db'),
      newFolder
    )
      .then(folder => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${folder.id}`))
          .json(serializeFolder(folder));
      })
      .catch(next);
  });

  
foldersRouter
  .route('/:folder_id')
  .all((req, res, next) => {
    FoldersService.getById(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(folder => {
        if (!folder) {
          return res.status(400).json({
            error: { message: `Folder doesn't exist` } 
          });
        }
        res.folder = folder;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => { // eslint-disable-line no-unused-vars
    res.json(serializeFolder(res.folder));
  })
  .delete((req, res, next) => {
    FoldersService.deleteFolder(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(numRowsAffected => { // eslint-disable-line no-unused-vars
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { folder_name } = req.body;
    const folderToUpdate = { folder_name };

    const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length;
    if(numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain 'folder_name'`
        }
      });
    
    FoldersService.updateFolder(
      req.app.get('db'),
      req.params.folder_id,
      folderToUpdate
    )
      .then(numRowsAffected => { // eslint-disable-line no-unused-vars
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = foldersRouter;