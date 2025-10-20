const fs = require('fs')
const path = require('path')

// Constante para armazenar o local onde ficarao gravados os snapshops
const SHOTS_DIR = process.env.SCREENSHOTS_DIR

// Garantir que o nome do arquivo seja compatível (seja um nome seguro sem caracteres especiais (vai substituir por _) e possua até 120 caracteres)
function safe_name(name){
    return String(name).replace(/[^\w\d-_.]+/g, '_').slice(0, 120)      
}

// Criacao de um conjunto de parametros para ser utilizado na proxima funcao
/**
 * Salvar o screenshot quando solicitado, com nome amigável
 * @param { import('@playwright/test').Page} page                       // criacao do parametro page com a estrutura informada (para pegar os dados da pagina)
 * @param { import('@playwright/test').TestInfo} test_info              // criacao do parametro test_info com as informacoes do teste 
 * @param { string } label                                              // criacao do parametro label do tipo string
*/

// Funcao para tirar os prints
async function snap(page, test_info, label){
    // Pega informacoes do Playwright para formar o nome do arquivo
    const file = `${safe_name(test_info.title)}__${safe_name(label)}.png`   // Por padrão quando a gente tira o print, tira no formato png (boa qualidade)
    const dest = path.join(SHOTS_DIR, file)

    // Gravacao do arquivo
    fs.mkdirSync(SHOTS_DIR, { recursive: true })
    await page.screenshot({ path: dest, fullPage: true})                // Tira o print. Se fullPage = true (tira uma foto da tela inteira, mesmo do que não está visível)
    return dest
}

// Exporta a funcao para ficar visivel para todo o projeto
module.exports = { snap }