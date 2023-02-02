
const currencyOneEl = document.querySelector('[data-js="currency-one"]')
const currencyTwoEl = document.querySelector('[data-js="currency-two"]')
const currenciesEl = document.querySelector('[data-js="currencies-container"]')

const url =`https://v6.exchangerate-api.com/v6/8476b0fd96bcb0b71a30c554/latest/USD`

const getErrorMessage = errorType => ({
  'unsupported-code': 'A moeda não existe em nosso banco de dados.',
  'malformed-request': 'A estrutura do seu request não está correta.',
  'invalid-key': 'Chave de API inválida',
  'inactive-account': 'Endereço de e-mail não foi confirmado.',
  'quota-reached': 'Você atingiu o número máximo de solicitações permitidas para seu plano.'
})[errorType] || 'Não foi possível obter informações.'

const fetchExchangeRate = async () => {
  try {
    const response = await fetch(url)

    // if(!response.ok) {
    //   throw new Error('Sua conexão falhou. Não foi possível obter as informações.')
    // }

    const exchangeRateData = await response.json()

    if(exchangeRateData.result === 'error') {
      throw new Error(getErrorMessage(exchangeRateData['error-type']))
    }

    return exchangeRateData
  } catch (error) {
    const div = document.createElement('div')
    const button = document.createElement('button')

    div.textContent = error.message
    div.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show')
    div.setAttribute('role', 'alert')
    button.classList.add('btn-close')
    button.setAttribute('type', 'button')
    button.setAttribute('aria-label', 'Close')

    button.addEventListener('click', () => {
      div.remove()
    })

    div.appendChild(button)
    currenciesEl.insertAdjacentElement('afterend', div)

  }
}

const init = async () => {
  const exchangeRateData = await fetchExchangeRate()

   const getOptions = selectedCurrency => Object.keys(exchangeRateData.conversion_rates)
    .map(currency => `<option ${currency === selectedCurrency ? 'selected' : ''}>${currency}</option>`)
    .join('')
  
  currencyOneEl.innerHTML = getOptions('USD')
  currencyTwoEl.innerHTML = getOptions('BRL')
}

init()