// FLUXO E2E COMPLETO - COMECEI NA TELA INICIAL DO LOGIN, ENTREI NA TELA DE PRODUTOS E FIZ TODO O CICLO DE COMPRA ATÉ O FINAL

// 1 - Referências e bibliotecas
// Declara um objeto chamado test vindo da biblioteca Playwright
const { test, expect } = require('@playwright/test')

// 2 - Classe ou Funções ou Métodos
// Um script pode executar de forma:
// - Sincrona: Simultâneo. Ex.: ligação de voz
// - Assincrona: Separados. Ex.: mensagem de texto no WhatsApp - consigo atender várias pessoas de uma vez. 
// Tende a ser mais rápido no assincrono. Quando a gente tem 1, 10 testes não tem muita diferença, mas quando se tem 1000 testes ai começa a aparecer a diferença.
test('Realizar o fluxo de compra da mochila', async ({page}) => {
    // sempre que usar assincrono as linhas iniciam com await
    // page é meu objeto que controla a página
    await page.goto('https://www.saucedemo.com')                        // abre o browser no site alvo
    // Só é um teste se verifica. Se eu escrever um teste script que clica, preenche, faz um monte de coisas, mas não checa nd, isso não é um teste
    await expect(page).toHaveURL('https://www.saucedemo.com')           // verifica se está na página raiz
    const botao_login = page.locator('#login-button')                   // sempre que for utilizar o localizador do campo pelo id tem que colocar o #
    await expect(botao_login).toHaveText('Login')                       // verifica elemento escrito Login
    
    
    // Página inicial - Realizar o login
    
    //await page.locator('[name="user-name"]')                          // sempre que for utilizar o localizador do campo pelo name, usa desta forma
    // Preencher o campo cujo localizador é name com o valor standard_user
    await page.fill('[name="user-name"]','standard_user')  
    // Preencher o campo cujo localizador é cssSelector com o valor secret_sauce
    await page.fill('[placeholder="Password"]','secret_sauce')          // poderia ser da mesma forma do usuário
    // Clicar no botão Login - já temos o método na linha 16 com o botão mapeado
    await botao_login.click()                                           // se não tiver o método ->  page.locator('#login-button').click()  
    
    
    // Página de Inventário / Produtos
    
    // Verificar se está na página certa
    await expect(page).toHaveURL(/.*inventory/)
    // Verificando o título da página
    let tituloSecao = 'span.title'                                      // cssSelector - pegar a primeira palavra da tag . a classe
    await expect(page.locator(tituloSecao)).toHaveText('Products')      // localização (expect) . comparação (toHaveText)
    
    // Adicionar a mochila no carrinho de compras
    const btnAdicionar = 'xpath=/html/body/div[1]/div/div/div[2]/div/div/div/div[1]/div[2]/div[2]/button'   //posso colocar em uma constante, uma variável
    await page.locator(btnAdicionar).click()
    // Verificar se exibe o nº 1 no carrinho de compras
    let iconeQuantCart = 'span.shopping_cart_badge'                   // cssSelector pode ser assim também : '.shopping_cart_badge' 
    //const iconeQuantCart = '#shopping_cart_container > a'             // Selector direto, tem a estrutura de quem está dendo do outro. Vai procurar algo cujo id (#) seja shoppint_cart_container e esteja dentro do a - Ver Outras formas de identificar o localizador no OneNote.
    await expect(page.locator(iconeQuantCart)).toHaveText('1')

    // Clicar no icone do carrinho (nº 1)
    await page.locator(iconeQuantCart).click()

    
    // Página Carrinho

    // Verificar se está na página certa - Cart
    await expect(page).toHaveURL(/.*cart/)
    // Verificando o título da página
    // tituloSecao permanece igual ao da página Inventory
    tituloSecao = '.title'
    await expect(page.locator(tituloSecao)).toHaveText('Your Cart')      // localização (expect) . comparação (toHaveText)

    // Verificar dados funcionais
    await expect(page.locator('.cart_quantity')).toHaveText('1')
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack')
    await expect(page.locator('.inventory_item_price')).toHaveText('$29.99')

    // Ir para a tela de Checkout
    const btnCheckout = 'button.btn.btn_action.btn_medium.checkout_button'
    await page.locator(btnCheckout).click()
    
    
    // Página Checkout

    // Verificar a página acessada
    await expect(page).toHaveURL(/.*checkout-step-one/)
    tituloSecao = '.title'
    await expect(page.locator(tituloSecao)).toHaveText('Checkout: Your Information')
    
    // Preencher dados da página
    const firtsName = '#first-name', lastName = '#last-name', postalCode = '#postal-code'
    await page.fill(firtsName, 'Maria')
    await page.fill(lastName, 'Silva')
    await page.fill(postalCode,'35500-000')

    // Ir para a tela Overview
    let btnAvancar = '#continue'
    await page.locator(btnAvancar).click()


    // Página Overview

    // Verificar a página acessada
    await expect(page).toHaveURL(/.*checkout-step-two/)
    tituloSecao = '.title'
    await expect(page.locator(tituloSecao)).toHaveText('Checkout: Overview')

    // Verificar dados exibidos na página
    await expect(page.locator('#checkout_summary_container > div > div.cart_list > div.cart_item > div.cart_quantity')).toHaveText('1')
    await expect(page.locator('#item_4_title_link > div')).toHaveText('Sauce Labs Backpack')
    await expect(page.locator('#checkout_summary_container > div > div.cart_list > div.cart_item > div.cart_item_label > div.item_pricebar > div')).toHaveText('$29.99')
    await expect(page.locator('#checkout_summary_container > div > div.summary_info > div:nth-child(2)')).toHaveText('SauceCard #31337')
    await expect(page.locator('#checkout_summary_container > div > div.summary_info > div:nth-child(4)')).toHaveText('Free Pony Express Delivery!')
    await expect(page.locator('.summary_subtotal_label')).toHaveText('Item total: $29.99')
    await expect(page.locator('.summary_tax_label')).toHaveText('Tax: $2.40')
    await expect(page.locator('.summary_total_label')).toHaveText('Total: $32.39')

    // Ir para a tela Complete
    btnAvancar = "#finish"
    await page.locator(btnAvancar).click()


    // Página Complete

    // Verificar a página acessada
    await expect(page).toHaveURL(/.*checkout-complete/)
    tituloSecao = '.title'
    await expect(page.locator(tituloSecao)).toHaveText('Checkout: Complete!')

    // Verificar dados exibidos na página
    await expect(page.locator('#checkout_complete_container > h2')).toHaveText('Thank you for your order!')
    // Verificar se o carrinho está vazio
    iconeQuantCart = '#shopping_cart_container > a'                    
    await expect(page.locator(iconeQuantCart)).toHaveText(' ')

    // Ir para a tela Products
    btnAvancar = '#back-to-products'
    await page.locator(btnAvancar).click()
    
    
    // Página Products

    // Verificar a página acessada
    await expect(page).toHaveURL(/.*inventory/)
    
    // Verificar o título da página
    tituloSecao = '.title'                                      
    await expect(page.locator(tituloSecao)).toHaveText('Products')

    


    // Espera de 1 segundo
    await page.waitForTimeout(1000)                                     // É uma espera bruta, é mal vista. A gente usa apenas para experimentar, para ver como as coisas estão indo. Depois a gente pode colocar ele como outro tipo de espera.

    

}) // Final do teste