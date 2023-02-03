
const currencyOneEl = document.querySelector('[data-js="currency-one"]')
const currencyTwoEl = document.querySelector('[data-js="currency-two"]')
const currenciesEl = document.querySelector('[data-js="currencies-container"]')
const convertedValueEl = document.querySelector('[data-js="converted-value"]')
const valuePrecisionEl = document.querySelector('[data-js="conversion-precision"]')
const timesCurrencyOneEl = document.querySelector('[data-js="currency-one-times"]')

let internalExchangeRate = {}

const getUrl = currency => `https://v6.exchangerate-api.com/v6/8476b0fd96bcb0b71a30c554/latest/${currency}`

const getErrorMessage = errorType => ({
  'unsupported-code': 'A moeda não existe em nosso banco de dados.',
  'malformed-request': 'A estrutura do seu request não está correta.',
  'invalid-key': 'Chave de API inválida',
  'inactive-account': 'Endereço de e-mail não foi confirmado.',
  'quota-reached': 'Você atingiu o número máximo de solicitações permitidas para seu plano.'
})[errorType] || 'Não foi possível obter informações.'

const fetchExchangeRate = async url => {
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
  internalExchangeRate = { ...(await fetchExchangeRate(getUrl('USD'))) }

   const getOptions = selectedCurrency => Object.keys(internalExchangeRate.conversion_rates)
    .map(currency => `<option ${currency === selectedCurrency ? 'selected' : ''}>${currency}</option>`)
    .join('')
  
  currencyOneEl.innerHTML = getOptions('USD')
  currencyTwoEl.innerHTML = getOptions('BRL')

  convertedValueEl.textContent = (internalExchangeRate.conversion_rates.BRL).toFixed(2)
  valuePrecisionEl.textContent = `1 USD = ${internalExchangeRate.conversion_rates.BRL} BRL`
}

timesCurrencyOneEl.addEventListener('input', event => {
  
  convertedValueEl.textContent = (event.target.value * internalExchangeRate.conversion_rates[currencyTwoEl.value]).toFixed(2)
 })

 currencyTwoEl.addEventListener('input', event => {
  const currencyTwoValue = internalExchangeRate.conversion_rates[event.target.value]

  convertedValueEl.textContent = (timesCurrencyOneEl.value * currencyTwoValue).toFixed(2)
  valuePrecisionEl.textContent =  `1 ${currencyOneEl.value} = ${1 * internalExchangeRate.conversion_rates[currencyTwoEl.value]} ${currencyTwoEl.value}`
 })

 currencyOneEl.addEventListener('input', async event => {
  internalExchangeRate = { ...(await fetchExchangeRate(getUrl(event.target.value))) }

  convertedValueEl.textContent = (timesCurrencyOneEl.value * internalExchangeRate.conversion_rates[currencyTwoEl.value]).toFixed(2)
  valuePrecisionEl.textContent = `1 ${currencyOneEl.value} = ${1 * internalExchangeRate.conversion_rates[currencyTwoEl.value]} ${currencyTwoEl.value}`
 })

init()