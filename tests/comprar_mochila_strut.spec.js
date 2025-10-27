// Importando o Playwright para passar uma extensão que foi feita no looger.js 
// testes e verificacoes - se nao tiver um expect no seu script entao nao e um teste, nao sao so os passos de navegacao, tem que checar alguma coisa
import { test, expect } from '../utils/logger.js'
import { snap } from '../utils/snap.js'

// Funcoes de apoio
async function login_step(page) {
    await page.goto('/')
    await expect(page).toHaveURL('/')                                               // verificacao clássica
    await page.waitForLoadState('load')                                             // espera a página carregar por completo
    await expect(page.locator('[data-test="login-button"]')).toHaveText('Login')    // verificacao clássica
}

async function success_login_fill_step(page) {
    await page.locator('[data-test="username"]').fill('standard_user')
    await page.locator('[data-test="password"]').fill('secret_sauce')
}

async function success_login_click_step(page) {
    await page.locator('[data-test="login-button"]').click()
    await expect(page).toHaveURL(/inventory\.html/)
    await expect(page.locator('[data-test="title"]')).toHaveText('Products')
}

async function add_to_cart_step(page) {
    await page.locator('[data-test="shopping-cart-link"]').click()
    await expect(page).toHaveURL(/cart\.html/)
    await expect(page.locator('[data-test="title"]')).toHaveText('Your Cart')
    await expect(page.locator('[data-test="item-quantity"]')).toHaveText('1')
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack')
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99')
 }

async function success_to_cart_step(page) {
    await page.locator('[data-test="checkout"]').click()
    await expect(page).toHaveURL(/checkout-step-one\.html/)
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information')
}

async function success_checkout_fill_step(page) {
    await page.fill('[data-test="firstName"]', 'Maria')  
    await page.fill('[data-test="lastName"]', 'Silva')  
    await page.fill('[data-test="postalCode"]', '35500-000')  
}

async function success_checkout_click_step(page) {
    await page.locator('[data-test="continue"]').click()
    await expect(page).toHaveURL(/checkout-step-two\.html/)
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Overview')
}

async function success_overview_check_step(page){
    await expect(page.locator('[data-test="item-quantity"]')).toHaveText('1')
    await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack')
    await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99')
    await expect(page.locator('[data-test="payment-info-value"]')).toHaveText('SauceCard #31337')
    await expect(page.locator('[data-test="shipping-info-value"]')).toHaveText('Free Pony Express Delivery!')
    await expect(page.locator('[data-test="subtotal-label"]')).toHaveText('Item total: $29.99')
    await expect(page.locator('[data-test="tax-label"]')).toHaveText('Tax: $2.40')
    await expect(page.locator('[data-test="total-label"]')).toHaveText('Total: $32.39')
}

async function success_overview_click_step(page) {
    await page.locator('[data-test="finish"]').click()
    await expect(page).toHaveURL(/checkout-complete\.html/)
    await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!')
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!')
    await expect(page.locator('[data-test="shopping-cart-link"]')).toHaveText(' ')
}


// Descricao do teste  (grupo de testes)
test.describe('SauceDemo - fluxo principal de compra', () => {
    
    // Inicio do teste 1
    test('Comprar_Mochila_Direto', async({ page }, testInfo) => {
        
        testInfo.setTimeout(testInfo.timeout + 15000)                       // este tempo seria o tempo geral 'timeout' que está no playwright.config

        // Inicio do passo 1
        await test.step('Acessar SauceDemo.com', async() => {
            await login_step(page)
            await snap(page, testInfo, 'TC001-Passo01-Home')
        })  // Fim do passo 1

        // Inicio do passo 2
        await test.step('Login com sucesso', async() => {
            await success_login_fill_step(page)
            await snap(page, testInfo, 'TC001-Passo02A-Login_Preenchido')
            await success_login_click_step(page)
            await snap(page, testInfo, 'TC001-Passo02B-Inventory')
        })  // Fim do passo 2

        // Inicio do passo 3
        await test.step('Adicionar mochila no carrinho', async () => {
            const seletor_mochila = page.locator('.inventory_item').filter({ hasText: /Backpack/ })     // seleciona o bloco do produto (cartão) onde tem a palavra mochila
            await seletor_mochila.getByRole('button', { name: /Add to cart/ }).click()                  // dentro do bloco eu quero botão com o nome 'Add to cart'
            await expect(page.locator('.shopping_cart_badge')).toHaveText('1')
            await snap(page, testInfo, 'TC001-Passo03-Mochila_Adicionada')
        })  // Fim do passo 3

        // Inicio do passo 4
        await test.step('Ir para o carrinho', async () => {
            await add_to_cart_step(page)
            await snap(page, testInfo, 'TC001-Passo04-Carrinho_Conferido')

        })  // Fim do passo 4

        // Inicio do passo 5
        await test.step('Ir para o checkout', async () => {
            await success_to_cart_step(page)
            await snap(page, testInfo, 'TC001-Passo05-Checkout_Your_Information')
        })  // Fim do passo 5

         // Inicio do passo 6
        await test.step('Checkout com sucesso', async () => {
            await success_checkout_fill_step(page)
            await snap(page, testInfo, 'TC001-Passo06A-Informacoes_Preenchidas')
            await success_checkout_click_step(page)
            await snap(page, testInfo, 'TC001-Passo06B-Checkout_Overview')
        })  // Fim do passo 6

        // Inicio do passo 7
        await test.step('Ir para o overview', async () => {
            await success_overview_check_step(page)
            await snap(page, testInfo, 'TC001-Passo07A-Informacoes_Conferidas')
            await success_overview_click_step(page)
            await snap(page, testInfo, 'TC001-Passo07B-Checkout_Complete')

        })  // Fim do passo 7


    })  // Fim do teste 1

    // Inicio do teste 2
    test('Comprar_Mochila_Detalhes', async({ page }, testInfo) => {
        
        testInfo.setTimeout(testInfo.timeout + 15000)

         // Inicio do passo 1
        await test.step('Acessar SauceDemo.com', async() => {
            await login_step(page)
            await snap(page, testInfo, 'TC002-Passo01-Home')
        })  // Fim do passo 1

        // Inicio do passo 2
        await test.step('Login com sucesso', async() => {
            await success_login_fill_step(page)
            await snap(page, testInfo, 'TC002-Passo02A-Login_Preenchido')
            await success_login_click_step(page)
            await snap(page, testInfo, 'TC002-Passo02B-Inventory')
        })  // Fim do passo 2

        // Inicio do passo 3
        await test.step('Abrir página da mochila e adicionar no carrinho', async () => {

            // Parte 3.A - Abrir a pagina da mochila
            // acao
            await page.locator('[data-test="item-4-title-link"]').click()                               // codigo do produto 4 = mochila
            
            // verificacoes (assert)
            // Estamos na pagina certa?
            await expect(page).toHaveURL(/inventory-item\.html/)                                        // a barra funciona como se fosse uma url
            await expect(page).toHaveTitle('Swag Labs')
            await expect(page.locator('[data-test="back-to-products"]')).toHaveText('Back to products')
            // As informacoes do produto estao certas?
            await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText("Sauce Labs Backpack")
            await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText("$29.99")

            await snap(page, testInfo, 'TC002-Passo03A-Intentory_Item')

            // Parte 3.B - Adicionar produto no carrinho
            // acao
            await page.locator('[data-test="add-to-cart"]').click()
            // verificacoes
            await expect(page.locator('.shopping_cart_badge')).toHaveText('1')
            await snap(page, testInfo, 'TC002-Passo03B-Mochila_Adicionada')

        })  // Fim do passo 3

        // Inicio do passo 4
        await test.step('Ir para o carrinho', async () => {
            await add_to_cart_step(page)
            await snap(page, testInfo, 'TC002-Passo04-Carrinho_Conferido')
        })  // Fim do passo 4

        // Inicio do passo 5
        await test.step('Ir para o checkout', async () => {
            await success_to_cart_step(page)
            await snap(page, testInfo, 'TC002-Passo05-Checkout_Your_Information')
        })  // Fim do passo 5

         // Inicio do passo 6
        await test.step('Checkout com sucesso', async () => {
            await success_checkout_fill_step(page)
            await snap(page, testInfo, 'TC002-Passo06A-Informacoes_Preenchidas')
            await success_checkout_click_step(page)
            await snap(page, testInfo, 'TC002-Passo06B-Checkout_Overview')
        })  // Fim do passo 6

        // Inicio do passo 7
        await test.step('Ir para o overview', async () => {
            await success_overview_check_step(page)
            await snap(page, testInfo, 'TC002-Passo07A-Informacoes_Conferidas')
            await success_overview_click_step(page)
            await snap(page, testInfo, 'TC002-Passo07B-Checkout_Complete')

        })  // Fim do passo 7

    })  // Fim do teste 2

})  // Fim do describe