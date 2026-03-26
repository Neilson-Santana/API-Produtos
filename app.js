const express = require('express');
const app = express();
const produtoRoutes = require('./routes/produtosRoutes');

app.use(express.json());

app.use('/produtos', produtoRoutes);

app.listen(3000, ()=>{
    console.log('Servidor rodando em http://localhost:3000/produtos');
});