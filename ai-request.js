// [0] SETUP AND VALIDITY CHECKS //
const apiKey = secrets.apiKey

// if: API KEY is required and not set, throw an error.
if (apiKey == "" || apiKey == undefined || apiKey == null || apiKey == "undefined" || apiKey == "null" || apiKey == "API_KEY")
{
    throw Error(
        "OPENAI_KEY environment variable not set for the API."
    )
}

// [1] ARGUMENT DECLARATION //

// gets: tokenId passed to the request (`tokenId`)
const tokenId = args[0]

// gets: interval passed to the request (`interval`)
const interval = args[1]

// gets: forecastMethod passed to the request (`forecastMethod`)
const forecastMethod = args[2]

// gets: promptEngineering passed to the request (`promptEngineering`)
const historicalDays = Number(args[3])


// [2] REQUEST CREATION //

// uses: Functions to construct an HTTP request.
const priceRequest = await Functions.makeHttpRequest({
    url: `https://api.coincap.io/v2/assets/${tokenId}/history?interval=${interval}`,
})

// executes: request, then waits for the sorted response.
const priceResponse = await priceRequest.data.data.sort(
    // sorts by: time in descending order.
    function(a, b) {
        return b.time - a.time
    }
)

// [3] RESPONSE HANDLING //
const prices = []

for (let i=0; i<historicalDays; i++) {
        prices.push(priceResponse[i].priceUsd)
}
    
// [4] PROMPT ENGINEERING //
const prompt = 
`Historical Data: ${prices}. Based off the historical data, use a ${forecastMethod} forecast to predict the price at the next timestamp in the time series.
No explanation. Only report a float number with no dollar sign and no context.`

// [5] AI DATA REQUEST //

// requests: OpenAI API using Functions
const openAIRequest = await Functions.makeHttpRequest({
    // url: URL of the API endpoint (required)
    url: `https://api.openai.com/v1/chat/completions`,
    // defaults to 'GET' (optional)
    method: "POST", 
    // headers: supplied as an object (optional)
    headers: { 
    "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
    },
    // defines: data payload (request body as an object).
    data: { 
        "model": "gpt-3.5-turbo",
        "messages": [
        {
            "role": "system",
            "content": "You are forecasting the price of a token."
        },
        {
            "role": "user",
            "content": prompt
        }
    ]},
    // timeout: maximum request duration in ms (optional, defaults to 10000ms)
    timeout: 10_000,
    maxTokens: 100,
    // responseType: expected response type (optional, defaults to 'json')
    responseType: "json",
    // params: URL query parameters supplied as an object (optional)
    params: {}
})

const response = await openAIRequest

// finds: the response and returns the result.
let result = response.data?.choices[0].message.content
console.log(`${forecastMethod} forecast: %s`, response.data?.choices[0].message.content)
console.log(`${forecastMethod} forecast: %s`, response.data?.choices[0].message.content)
// 63062.76387686369
// Note: source code MUST return a Buffer or the request will return an error message.

// Use one of the following functions to convert to a Buffer representing the response bytes that are returned to the consumer smart contract:
// - Functions.encodeUint256
// - Functions.encodeInt256
// - Functions.encodeString
// Or return a custom Buffer for a custom byte encoding
return Functions.encodeString(result)