// snapshot = print  --> queremos quando falha e quando passa
// 1 print ou N por execução? N
// Criar uma pasta chamada Snapshots e colocar todos os prints dentro
// Organize as datas no formato universal yyyy-mm-dd

// Bibliotecas
const fs = require('fs')                                    // File System / biblioteca do Sistema Operacional 
const path = require('path')                                // biblioteca de caminhos de pastas/arquivos

// Formatar números com zero na frente se precisar
function pad2(num) {return String(num).padStart(2, '0')}   // pad2 é um termo em inglês usado para garantir que um número tem 2 dígitos


// Função para definir a data e hora baseado no momento da execução
// Data e hora que iniciou o teste
function compute_run_folder(baseDir) {                       // baseDir é o endereco raiz (exemplos: c:\Iterasys\SauceDemo145, endereço ip da rede) caminho inicial antes de criar as pastas
    // Cria o carimbo de data via CI (Integração Contínua)
    // RUN_TAG é uma variável de ambiente
    if (process.env.RUN_TAG){                               // == true  (para comparar igual a true a gente deixa só o nome da variável)
        // Vai manter o que está escrito e depois vai colocar o underline
        // CI
        const tag = process.env.RUN_TAG.replace(/[^\w-:.]/g, '_')       // Regex = Expressão regular (é isso tudo que está dentro do replace antes da vírgula)
        // Vai juntar o caminho (baseDir) + o nome que já tinha (tag)
        const runDir = path.join(baseDir, tag)
        // Cria uma pasta no diretório de execucao
        fs.mkdirSync(runDir, {recursive: true})             // Se tiver algum outro processo executando ele vai esperar um pouco
        // Retorna o caminho
        return runDir
    }
   
    // Verifica a data e hora
    const now = new Date()                                  // Perguntar para o computador que dia e horas são
    const yyyy = now.getFullYear()                          // Ano com 4 dígitos
    const MM = pad2(now.getMonth())                         // Mês com 2 dígitos
    const dd = pad2(now.getDay())                           // Dia com 2 dígitos
    const HH = pad2(now.getHours())                         // Hora com 2 dígitos
    const mm = pad2(now.getMinutes())                       // Minutos com 2 dígitos
    const ss = pad2(now.getSeconds())                       // Segundos com 2 minutos

    // Cria as pastas
    // Irá juntar o baseDir (caminho original) + as informações de data e hora
    const runDir = path.join(baseDir, `${yyyy}`, `${MM}`,`${dd}`,`${HH}-${mm}-${ss}`)      // usa crase para concatenar variáveis
    fs.mkdirSync(runDir, {recursive: true})
    return runDir

}

// Cria subpastas dentro da estrutra de datas e horas
function ensure_subdirs(runDir){
    // Lista de subpastas
    const dirs = {
        runDir,
        resultsDir:     path.join(runDir, 'test-results'),       // Diretorio onde ficam os resultados
        screenshotsDir: path.join(runDir, 'screenshots')        // Adiciona uma pasta screenshots dentro da pasta
    }

    // Execução da estrutura const dirs (lista)
    Object.values(dirs).forEach(d => {                          // d = diretório (subdiretorio)
        // Se nao existir esse dado (considerando a const dirs seria screenshots ou qualquer outra palava que tiver lá) a gente cria
        // o diretorio sincronizado com esse nome
        if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true})
          
    })

    return dirs
}

// Exporta as duas funcoes para ficar visivel para todo o projeto
module.exports = { compute_run_folder, ensure_subdirs}         