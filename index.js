const customExpress = require('./config/customExpress')
const conexao = require('./infraestrutura/database/conexao')
const tabelas = require('./infraestrutura/database/tabelas')

conexao.connect(erro => {
    if (erro){
        console.log(erro)
    } else {

        console.log('conectado com sucesso na base de dados')
        
        tabelas.init(conexao)

        const app = customExpress()

        app.listen(3000, () => console.log('servidor rodando na porta 3000'))
    }
})

