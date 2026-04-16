const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtosController');

router.get('/buscar/nome/:nomeProd', produtoController.buscarPorNome);

router.get('/buscar/id/:idProd', produtoController.getUsersById);

router.get('/', produtoController.getUsers);

router.post('/', produtoController.createUser);

router.put('/:idProd', produtoController.updateUser);

router.delete('/:idProd', produtoController.deleteUser);

module.exports = router;