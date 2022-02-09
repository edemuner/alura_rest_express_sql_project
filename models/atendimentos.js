const conexao = require('../infraestrutura/database/conexao')
const moment = require('moment')
const axios  = require('axios')
const repositorio = require('../repositorios/atendimentos')

class Atendimento {

    constructor(){
        // data válida somente se no futuro
        this.dataValida = (data, dataCriacao) => moment(data).isSameOrAfter(dataCriacao)

        this.clienteValido = (tamanho) => tamanho >= 5

        this.valida = parametros => this.validacoes.filter(campo => {
             const {nome} = campo
             const parametro = parametros[nome]

             return campo.valido(parametro)
        })

        this.validacoes = [
            {
                nome: 'data',
                valido:this.dataValida,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: this.clienteValido,
                mensagem: 'Cliente deve ter pelo menos cinco caracteres'
            }
        ]
    }

    adiciona(atendimento){
        
        const dataCriacao = moment().format('YYYY-MM-DD HH:mm:ss')

        const data = moment(atendimento.data, 'DD-MM-YYYY hh:mm:ss').format('YYYY-MM-DD HH:mm:ss')

        const parametros = {
            data: { data, dataCriacao },
            cliente: { tamanho: atendimento.cliente.length }
        }

        const erros =  this.valida(parametros)

        const existemErros = erros.length

        // se esse filtro tiver qualquer comprimento, a query não é executada e o erro é exibido
        if (existemErros){
            return new Promise((resolve, reject) => {
                reject(erros)
            })
        }
        else {
        const atendimentoDatado = {...atendimento, dataCriacao, data}

        return repositorio.adiciona(atendimentoDatado)
            .then((resultados) => {
                const id = resultados.insertId
                return ({...atendimento, id})
            })
        }
        
        
    }
    
    lista(res){
        return repositorio.lista
    }

    buscaPorId(id, res){

        return repositorio.buscaPorId(id)
            .then(async resultados => {
                const atendimento = resultados[0]
                const cpf = atendimento.cliente

                const { data } = await axios.get(`http://localhost:8082/${cpf}`)
                atendimento.cliente = data
                return atendimento
            })
    }

    altera(id, valores){

        if (valores.data){
            valores.data = moment(valores.data, 'DD-MM-YYYY hh:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        }

        return repositorio.altera(id, valores)

        // conexao.query(sql, [valores, id], (erro, resultados) => {
        //     if (erro){
        //         res.status(400).json(erro)
        //     } else {
        //         res.status(200).json({...valores, id})
        //     }

        // })
    }

    deleta(id, res){

        const sql = 'DELETE FROM Atendimentos WHERE id=?'
        conexao.query(sql, id, (erro, resultados) => {
            if (erro){
                res.status(400).json(erro)
            } else {
                res.status(200).json({id})
            }
        })
    }

}

module.exports = new Atendimento