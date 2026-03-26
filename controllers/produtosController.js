const produtoModel = require('../models/produtosModel');
//Read (get/produto) - buscar todos
exports.getUsers = async (req, res) => {
    try {
        const produto = await produtoModel.findAll();
        res.json(produto);
    } catch (err) {
        console.error('Erro ao buscar produto: ', err);
        res.status(500).json({ error: 'Erro interno ao buscar produto'});
    }
};
//Creat (Post/produto) - criar novo
exports.createUser = async(req, res)=>{
    const {nomeProd, preco, catProd, modelo, fabricante, estoque, locall} = req.body;
    //validar os campos que são obtigatorios
    if(!nomeProd || !preco || !catProd || !modelo || !fabricante || !estoque || !locall){
        return res.status(400).json({ error: " Os campos nomeProd, preco, catProd, modelo, fabricante, estoque e local são obrigatórios"})
    }
    try{
        const newProduto = await produtoModel.create(nomeProd, preco, catProd, modelo, fabricante, estoque, locall);
        res.status(201).json(newProduto)
    } catch(err){
        console.error('Erro ao criar produto', err);
        res.status(500).json({error: "Erro interno ao criar produto"})
    }
};
//Update (Put/produto/:idProd) - Atualizar Existente
exports.updateproduto = async (req, res) => { 
    const idProd = req.params.idProd; // Captura ID da URL 
    const {nomeProd, preco, catProd, modelo, fabricante, estoque, locall} = req.body; // Captura os novos dados     
    // Validação mínima
    if (!nomeProd || !preco || !catProd || !modelo || !fabricante || !estoque || !locall) { 
        return res.status(400).json({ error: 'Todos os campos são necessários para atualização.' }); 
    } 

    try { 
        // Passamos o ID e os novos campos para o Model
        const updatedproduto = await produtoModel.update(idProd, nomeProd, preco, catProd, modelo, fabricante, estoque, locall);          
        if (!updatedproduto) { 
            return res.status(404).json({ error: 'Produto não encontrado.' }); 
        } 

        res.json(updatedproduto);  
    } catch (err) { 
        console.error('Erro ao atualizar produto:', err); 
        res.status(500).json({ error: 'Erro interno ao atualizar produto' }); 
    } 
};
//Delete (del/produto/:idProd) - Deletar usuario
exports.deleteUser = async(req, res)=>{
    const idProd = req.params.idProd;

    try{
        const deleteProd = await produtoModel.delete(idProd);
        if(!deleteProd){
            return res.status(404).json({ error: "Produto nâo encontrado para a exclusâo"})
        }
        res.json({ message: "Produto removido com sucesso", user: deleteProd});
    } catch(err){
        console.error("Erro ao deletar produto", err);
        res.status(500).json({ error: "Erro interno ao deletar produto"})
    }
};