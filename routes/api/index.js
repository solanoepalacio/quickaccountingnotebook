const express = require('express');
const apiRouter = express.Router();

const {router, prefix} = require('./accounts');

apiRouter.use(prefix, router);

module.exports = apiRouter;