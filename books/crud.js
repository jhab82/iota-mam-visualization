// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const Mam = require('../lib/mam.client.js');
const IOTA = require('iota.lib.js');
const iota = new IOTA({ provider: 'https://nodes.devnet.thetangle.org:443'});

const MODE = 'public';
let key;
var nextRoot;

const router = express.Router();

// Automatically parse request body as form data
router.use(bodyParser.urlencoded({extended: false}));

// Set Content-Type for all responses for these routes
router.use((req, res, next) => {
  res.set('Content-Type', 'text/html');
  next();
});

// Initialise MAM State
let mamState = Mam.init(iota);
//key = iota.utils.toTrytes("tmmiot-iota-sideky");
mamState = Mam.changeMode(mamState, MODE);

// Receive data from the tangle
const executeDataRetrieval = async function (rootVal, keyVal, callback) {
    try {
        let resp = await Mam.fetchSingle(rootVal, MODE, keyVal);
        callback(false, resp);
    } catch (err) {
        callback(true, {"payload": "lastRoot", "nextRoot": nextRoot});
    }
}


/**
 * GET /books
 *
 * Display a page of books (up to ten at a time).
 */
router.get('/:id', (req, res, next) => {
  if (!iota.valid.isAddress(req.params.id)) {
      res.json({"payload": "invalid", "nextRoot": nextRoot})
  } else {
        executeDataRetrieval(req.params.id, key, function(err, success) {
            if (err) {
                console.log("error: " + err);
                res.json(success)
            } else {
                success.payload = JSON.parse(iota.utils.fromTrytes(success.payload));
                res.json(success);
            }
    });
  }
});

/*
function getModel() {
  return require(`./model-${require('../config').get('DATA_BACKEND')}`);
}
*/


module.exports = router;


/*

// [START add_post]
router.post('/add', (req, res, next) => {
  const data = req.body;

  // Save the data to the database.
  getModel().create(data, (err, savedData) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect(`${req.baseUrl}/${savedData.id}`);
  });
});
// [END add_post]

/**
 * GET /books/:id/edit
 *
 * Display a book for editing.

router.get('/:book/edit', (req, res, next) => {
  getModel().read(req.params.book, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.render('books/form.pug', {
      book: entity,
      action: 'Edit',
    });
  });
});
 */
/**
 * POST /books/:id/edit
 *
 * Update a book.
 
router.post('/:book/edit', (req, res, next) => {
  const data = req.body;

  getModel().update(req.params.book, data, (err, savedData) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect(`${req.baseUrl}/${savedData.id}`);
  });
});
*/