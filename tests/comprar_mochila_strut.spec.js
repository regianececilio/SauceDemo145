// Importando o Playwright para passar uma extensão que foi feit no looger.js 
import { test, expect } from '../utils/logger.js'
// Importando 
import { snap } from '../utils/snap.js'

// Funções de apoio
async function login_step(page, testInfo) {
    await page.goto('/')
    await expect(page).toHaveURL('/')                                               // verificacao clássica
    await page.waitForLoadState('load')                                             // espera a página carregar por completo
    await expect(page.locator('[data-test="login-button"]')).toHaveText('Login')    // verificacao clássica
    await snap(page, testInfo, 'TC001-Passo01-Home')
}

async function success_login_step(page, testInfo) {
    await page.locator('[data-test="username"]').fill('standard_user')
    await page.locator('[data-test="password"]').fill('secret_sauce')
    await snap(page, testInfo, 'TC001-Passo02A-Login_Preenchido')
    await page.locator('[data-test="login-button"]').click()
    await expect(page).toHaveURL(/inventory\.html/)
    await expect(page.locator('[data-test="title"]')).toHaveText('Products')
    await snap(page, testInfo, 'TC001-Passo02B-Inventory')
}

// Descricao do teste  (grupo de testes)
test.describe('SauceDemo - fluxo principal de compra', () => {
    
    // Inicio do teste 1
    test('Comprar_Mochila_Direto', async({ page }, testInfo) => {
        
        testInfo.setTimeout(testInfo.timeout + 15000)

        // Inicio do passo 1
        await test.step('Acessar SauceDemo.com', async() => {
            await login_step(page, testInfo)
        })  // Fim do passo 1

        // Inicio do passo 2
        await test.step('Login com sucesso', async() => {
            await success_login_step(page, testInfo)
        })  // Fim do passo 2

        // Inicio do passo 3
        await test.step('Adicionar mochila no carrinho', async () => {

            const seletor_mochila = page.locator('.inventory_item').filter({ hasText: /Backpack/ })     // seleciona o bloco do produto (cartão) onde tem a palavra mochila
            await seletor_mochila.getByRole('button', { name: /Add to cart/ }).click()                  // dentro do bloco eu quero botão com o nome 'Add to cart'
            await expect(page.locator('.shopping_cart_badge')).toHaveText('1')
            await snap(page, testInfo, 'TC001-Passo03-Mochila-Adicionada')

        })  // Fim do passo 3

        // Inicio do passo 4
        await test.step('Ir para o carrinho', async () => {

            await page.locator('[data-test="shopping-cart-link"]').click()
            await expect(page).toHaveURL(/cart\.html/)
            await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart')
            await expect(page.locator('[data-test="item-quantity"]')).toHaveText('1')
            await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack')
            await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99')
            await snap(page, testInfo, 'TC001-Passo04-Carrinho-Conferido')

        }) // Fim do passo 4

    })  // Fim do teste 1

    // Inicio do teste 2
    test('Comprar_Mochila Detalhes', async({ page }, testInfo) => {
        
        testInfo.setTimeout(testInfo.timeout + 15000)

         // Inicio do passo 1
        await test.step('Acessar SauceDemo.com', async() => {
            await login_step(page, testInfo)
        })  // Fim do passo 1

        // Inicio do passo 2
        await test.step('Login com sucesso', async() => {
            await sucess_login_step(page, testInfo)
        })  // Fim do passo 2

        // Inicio do passo 3
        await test.step('', async () => {

            const seletor_mochila = page.locator('.inventory_item').filter({ hasText: /Backpack/ })     // seleciona o bloco do produto (cartão) onde tem a palavra mochila
            await seletor_mochila.getByRole('link', { hasText: /Backpack/ }).click()                  // dentro do bloco eu quero botão com o nome 'Add to cart'
            
            // To Do: Concluir
            await expect(page.locator('.shopping_cart_badge')).toHaveText('1')
            await snap(page, testInfo, 'TC001-Passo03-Mochila-Adicionada')

        })  // Fim do passo 3


    })  // Fim do teste 2


})  // Fim do describe