require('dotenv').config();
const { Pool } = require('pg');
//configuração das variaveis de ambiente
const config = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
};
//criando a pool de conexões
const pool = new Pool(config);

pool.on('error', (err, client) => {
    console.error("Erro inesperado no cliente de Pool", err);
});
module.exports = pool;