// Importando o Playwright para passar uma extensão que foi feit no looger.js 
import { test, expect } from '../utils/logger.js'
// Importando 
import { snap } from '../utils/snap.js'

// Descricao do teste  (grupo de testes)
test.describe('SauceDemo - fluxo principal de compra', () => {
    
    // Acoes do teste
    test('Login, Adicionar mochila no carrinho e Verificacoes', async({ page }, testInfo) => {
        
        // Escrevendo no log
        testInfo.setTimeout(testInfo.timeout + 15000)

        // Passos do teste
        await test.step('Acessar SauceDemo.com', async() => {
            
            await page.goto('/')

            await expect(page).toHaveURL('/')                                           // verificacao clássica
            await page.waitForLoadState('load')                                         // espera a página carregar por completo
            await page.waitForResponse( response =>                                     // se voltou com status 200 - carregou com sucesso
                Response.url() === '/' && Response.status() === 200
                && Response.request().method() === 'GET'
            )
            await expect(page.locator('[data-test="username"]')).toHaveText('Login')    // verificacao clássica
            
            // Escrevendo no log
            await snap(page, testInfo, 'TC001-Passo01-Home')

        })  // fim do passo 1

        await test.step('Login com sucesso', async() => {
            
            await page.locator('[data-test="username"]').fill('standard_user')
            await page.locator('[data-test="password"]').fill('secret_sauce')
            await page.locator('[login-button"]').click()

            await expect(page).toHaveURL(/inventory\.html/)
            await expect(page.locator('[data-test="title"]')).toHaveText('Produts')
            
            // Escrevendo no log
            await snap(page, testInfo, 'TC001-Passo02-Inventory')

        })  // fim do passo 2

        await test.step('Adicionar mochila no carrinho', async () => {

            const seletor_mochila = page.locator('.inventory_item').filter({ hasText: /Backpack/ })         // seleciona o bloco do produto (cartão) onde tem a palavra mochila
            await seletor_mochila.getByRole('button', { name: /Add to cart/ }).click()                      // dentro do bloco eu quero botão com o nome 'Add to cart'

            await expect(page.locator('.shoppint_cart_badge')).toHaveText('1')

            await snap(page, testInfo, 'TC001-Passo03-Mochila-Adicionada')

        })  // fim do passo 3

    })  // fim do teste

})  // fim do describe