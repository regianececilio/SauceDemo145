const { defineConfig, devices } = require ('@playwright/test')           // biblioteca const, função defineConfig e devices recebe require do playwright
const path = require('path')
const { compute_run_folder, ensure_subdirs } = require('./utils/path_tools')      // Iremos utilizar funções que nós fizemos (está na biblioteca path_tools e foram exportadas)

// Diretórios onde ficam os artefatos
const ARTIFACTS_ROOT = path.join(__dirname, 'artifacts')        // Nome da pasta raiz - poderia ser evidências, artefatos, etc.
const runDir = compute_run_folder(ARTIFACTS_ROOT)
const { resultsDir, screenshotsDir } = ensure_subdirs(runDir)

// Expõe caminhos de diretórios como variáveis de ambiente
// Ira guardar o diretório de execução dos testes
process.env.RUN_DIR         = runDir
process.env.SCREENSHOTS_DIR = screenshotsDir

module.exports = defineConfig({                                 // module.exports serve para o que estiver fazendo fique visível para outro arquivo    
    testDir: '.tests',                                          // nossos testes estão na pasta tests
    timeout: 30000,                                             // tempo limite de execução 30_000 = 30 segundos, se passar ele vai abortar
    fullyParallel: true,                                        // execução em paralelo / multi thread (usado geralmente em ambientes onde pode ter testes simultâneos)
    outputDir: resultsDir,                                      // pra saber qual é a pasta que ele quer
    use: {                                                      // todos os parâmetro já são definidos, a gente não tem que inventar
        baseURL: 'https://www.saucedemo.com',                   // no teste vou informar '/' e com essa barra ele sabe que estou no endereço raiz
        headless: false,                                        // false exibe o browser e true oculta. A gente não precisa mais escrever na hora de executar por headless
        
        // Politicas globais de artefatos automáticos
        screenshot: 'only-on-failure',                          // tirar o print, quando der erro
        video:      'retain-on-failure',                        // salva o vídeo, se houver erro (esta sempre gravando, mas apaga se não der erro)
        trace:      'retain-on-failure',                        // salva o trice, se houver erro (registro do que acontece no processador, memoria, recursos) (é um log técnico mais detalhado)

        // outros tipos de timeout
        actionTimeout: 15000,                                   // aborta se nada estiver acontecendo em 15s
        navigationTimeout: 20000,                               // aborta se parar o navegador, se não tiver mudança de página no tempo informado

        launchOptions:{                                         // são opções do navegador que será executado
            slowMo: 1000                                        // câmera lenta - velocidade. Espere 1 segundo entre cada ação. 
        }                                            
    },

    projects: [
        {
            name: 'chromium',                                   // é o navegador que ja vem embutido no Playwright. Encima desse chromium é que o Google faz o Chrome.
            use: { ...devices['Desktop Chrome']}                // os três pontos é uma estrutura para usar uma interface, vc esta chamando os dispositivos, importa o dispositivo que vc quer executar os testes
        }
    ]

})                                