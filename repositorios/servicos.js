const query = require('../infraestrutura/database/queries')

class Servico {

    adiciona(servico){

        const sql = 'INSERT INTO Servicos SET ?'

        return query(sql, servico)
    }

    buscaIdPorNome(nome){

        const sql = 'SELECT id FROM Servicos WHERE nome = ?'

        return query(sql, nome)
    }
}

module.exports = new Servico