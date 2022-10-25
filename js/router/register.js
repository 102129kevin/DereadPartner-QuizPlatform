let express = require("express");
let regAPI = express.Router();
let RegisterController = require('../controllers/registerController');

registerController = new RegisterController();

regAPI.post('/register', registerController.register);

module.exports = regAPI;