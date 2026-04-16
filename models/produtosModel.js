const pool = require('../db');

// GET (lista todos os produtos)
exports.findAll = async () => {
    const text = 'SELECT idProd, nomeProd, preco, catProd, modelo, fabricante, estoque, locall FROM produtosInfo ORDER BY idProd';
    const result = await pool.query(text);
    return result.rows;
};

// GET (buscar por ID)
exports.findById = async (id) => {
    const text = 'SELECT * FROM produtosInfo WHERE idProd = $1';
    const result = await pool.query(text, [id]);
    return result.rows[0]; // Retorna apenas o objeto do produto
};

// GET (buscar por nome - parcial/case-insensitive)
exports.findByName = async (nome) => {
    const text = 'SELECT * FROM produtosInfo WHERE nomeProd ILIKE $1';
    const result = await pool.query(text, [`%${nome}%`]);
    return result.rows;
};

// POST (criar novo produto)
exports.create = async (nomeProd, preco, catProd, modelo, fabricante, estoque, locall) => {
    const text = `INSERT INTO produtosInfo (nomeProd, preco, catProd, modelo, fabricante, estoque, locall) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING *`;
    const values = [nomeProd, preco, catProd, modelo, fabricante, estoque, locall];
    const result = await pool.query(text, values);
    return result.rows[0];
};

// PUT (atualizar produto)
exports.update = async (idProd, nomeProd, preco, catProd, modelo, fabricante, estoque, locall) => {
    const text = `UPDATE produtosInfo 
    SET nomeProd = $1, preco = $2, catProd = $3, modelo = $4, fabricante = $5, estoque = $6, locall = $7
    WHERE idProd = $8   
    RETURNING *`;
    const values = [nomeProd, preco, catProd, modelo, fabricante, estoque, locall, idProd];
    const result = await pool.query(text, values);
    return result.rows[0];
};

// DELETE (deletar produto)
exports.delete = async (idProd) => {
    const text = 'DELETE FROM produtosInfo WHERE idProd = $1 RETURNING *';
    const values = [idProd];
    const result = await pool.query(text, values);
    return result.rows[0];
};