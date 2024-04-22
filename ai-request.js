// [0] SETUP AND VALIDITY CHECKS //
const API_KEY_REQUIRED = true

const apiKey = secrets.apiKey

// if: API KEY is required and not set, throw an error.
if (API_KEY_REQUIRED && (
    apiKey == "" ||
    apiKey === "API Key."
)) {
    throw Error(
        "API_KEY environment variable not set for the API."
    )
}

// (1) ARGUMENT DECLARATION //

// gets: tokenId passed to the request (`tokenId`)
const tokenId = 'bitcoin' // args[0]
// gets: interval passed to the request (`interval`)
const interval = 'd1' // args[1]

// gets: forecastMethod passed to the request (`forecastMethod`)
// const forecastMethod = args[2]


// [2] REQUEST CREATION //

// uses: the Functions.makeHttpRequest function to construct an HTTP request.

const coinCapRequest = Functions.makeHttpRequest({
    url: `https://api.coincap.io/v2/assets/${tokenId}/history?interval=${interval}`,
})

// executes: API requests concurrently, then wait for the responses.
const coinCapResponse = await coinCapRequest

// [3] RESPONSE HANDLING //

let historicalDays = 5

let _prices = [
    //     {
    //     "priceUsd": "28305.9784040535584856",
    //     "time": 1682985600000,
    //     "date": "2023-05-02T00:00:00.000Z"
    // }
]

for (let i=0; i<coinCapResponse.data.data.length; i++) {
    _prices.push(coinCapResponse.data.data[i].priceUsd)
}

const _totalPrices = _prices.length

console.log('_prices:', _prices)
console.log('_totalPrices:', _totalPrices)

const prices = _prices.slice(_totalPrices-historicalDays)

console.log('prices:', prices)

const stringifiedPrices = JSON.stringify(prices)
console.log('stringifiedPrices:', stringifiedPrices)

const prompt = `Historical Data: ${stringifiedPrices}. Based off the historical data, predict the price at the next timestamp in the time series.
                No explanation. Only report an float number with no dollar sign and no additional context.`

// Functions.makeHttpRequest function parameters:
    // - url
    // - method (optional, defaults to 'GET')
    // - headers: headers supplied as an object (optional)
    // - params: URL query parameters supplied as an object (optional)
    // - data: request body supplied as an object (optional)
    // - timeout: maximum request duration in ms (optional, defaults to 10000ms)
    // - responseType: expected response type (optional, defaults to 'json')


// requests: OpenAI API using Functions
const openAIRequest = Functions.makeHttpRequest({
    // url: "https://api.openai.com/v1/engines/davinci/completions",
    url: `https://api.openai.com/v1/completions`,
    method: "POST",
    headers: {
        // "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    },
    // defines: data payload.
    data: {
        "model": "gpt-3.5-turbo",       // specify the model you want to use
        "prompt": prompt,
        "temperature": 0.8,             // 0.0 (conservative) - 1.0 (creative)
        "max_tokens": 25,                // limits: spend amount
    },
    // responseType: "json"
})

const response = await openAIRequest

// ERROR: returns "Bad Request" (status: 400)
console.log("raw response", response)
console.log("raw response data", response.data)

let result = response.data?.data

// The source code MUST return a Buffer or the request will return an error message.

// Use one of the following functions to convert to a Buffer representing the response bytes that are returned to the consumer smart contract:
// - Functions.encodeUint256
// - Functions.encodeInt256
// - Functions.encodeString
// Or return a custom Buffer for a custom byte encoding
return Functions.encodeString(result)