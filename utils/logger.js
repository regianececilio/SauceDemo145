const { test: base } = require('@playwright/test')
const fs = require('fs')
const path = require('path')

// Formatar espacamento entre datas AM-PM
function isoTs() {
    const nova_data = new Date()
    return nova_data.toISOString().replace('T', ' ').replace('Z', '')
}

// Tenta achar o caminho pela variável de ambiente OU se não encontrar pega pela a pasta padrão do node (projeto) e cria as pastas artifacts e logs
const LOGS_DIR = process.env.LOGS_DIR || path.join(process.cwd(), 'artifacts', 'logs')     

// Se não existir a pasta, ele cria
if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, {recursive: true})

// Cria o arquivo de log para a execucao
const EXEC_LOG = path.join(LOGS_DIR, 'steps.log')

// Estrutura para escrever no arquivo de log
export const test = base.extend({
    // A função testInfo é a função que vai estar sendo injetada dentro da função padrão nossa de teste 
    log: async ({}, use, testInfo) => {
        // Mensagem que vai digitada pelo automatizador
        function log(message) {
            // Cada linha do log será composta por
            // {Data/Hora} {Titulo do teste} {Mensagem}
            const line = `[${isoTs()}] [${testInfo.title}] ${message} \n`
            // Escreve no arquivo
            fs.appendFileSync(EXEC_LOG, line, 'utf-8')
            return line;
        }        
        // Com essa linha é que vai poder utilizar este log no script do teste em seguida
        await use(log);
    }
})

// Para que seja vísivel o que foi feito
// Exporta o expect a partir do base.expect
export const expect = base.expect