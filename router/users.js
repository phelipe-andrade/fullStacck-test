const express = require('express');
const router = express.Router();
const usuariosControllers = require('../controllers/usuarios-controllers');

router.post('/cadastro', usuariosControllers.cadastrarUsuario);

router.post('/login', usuariosControllers.loginUsuario);

module.exports = router;
