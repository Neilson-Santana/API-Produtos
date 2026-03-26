const pool = require('../db');

//get (lista todos os produtos)
exports.findAll = async () => {
    const text = 'SELECT idProd, nomeProd, preco, catProd, modelo, fabricante, estoque, locall FROM produtosInfo ORDER BY idProd';
    const result = await pool.query(text);
    return result.rows;
}
// post(criar novo produto)
exports.create = async(nomeProd, preco, catProd, modelo, fabricante, estoque, locall) => {
    const text = `INSERT INTO produtosInfo (nomeProd, preco, catProd, modelo, fabricante, estoque, locall) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING *
    `;
    const values = [nomeProd, preco, catProd, modelo, fabricante, estoque, locall];
    const result = await pool.query(text, values);
    return result.rows;
}
//PUT (atualizar produto)
exports.update = async(idProd, nomeProd, preco, catProd, modelo, fabricante, estoque, locall) => {
    const text = `UPDATE produtosInfo 
    SET nomeProd = $1, preco = $2, catProd = $3, modelo = $4, fabricante = $5, estoque = $6, locall = $7
    WHERE idProd = $8   
    RETURNING *
    `;
    const values = [nomeProd, preco, catProd, modelo, fabricante, estoque, locall, idProd];
    const result = await pool.query(text, values);
    return result.rows;// retorna o registro atualizado
}
//DELETE (deletar produto)
exports.delete = async(idProd) => {
    const text = 'DELETE FROM produtosInfo WHERE idProd = $1 RETURNING *';
    const values = [idProd];
    const result = await pool.query(text, values);
    return result.rows;// retorna o registro deletado
};