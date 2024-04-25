// [0] SETUP AND VALIDITY CHECKS //
const API_KEY = secrets.apiKey

// if: API KEY is required and not set, throw an error.
if (API_KEY == "" || API_KEY == undefined || API_KEY == null || API_KEY == "undefined" || API_KEY == "null" || API_KEY == "API_KEY") {
    throw Error("OPENAI_KEY environment variable not set for the API.")
}

// [1] ARGUMENT DECLARATION //

// gets: token id passed to the request (`TOKEN_ID`)
const TOKEN_ID = args[0]

// gets: interval passed to the request (`INTERVAL`)
const INTERVAL = args[1]

// gets: precision to include in the result (`PRECISION`)
const PRECISION = args[2]

// gets: forecast method passed to the request (`FORECAST_METHOD`)
const FORECAST_METHOD = args[3]

// gets: number historical days for forecast analysis (`HISTORICAL_DAYS`)
const HISTORICAL_DAYS = Number(args[4])

// [2] REQUEST PRICES //

// constructs: an HTTP request for prices using Functions.
const priceRequest = await Functions.makeHttpRequest({
    // API Docs: https://docs.coincap.io/#ee30bea9-bb6b-469d-958a-d3e35d442d7a
    url: `https://api.coincap.io/v2/assets/${TOKEN_ID}/history?interval=${INTERVAL}`,
})

// executes: request, then waits for the sorted response.
const priceResponse = await priceRequest.data.data.sort(
    // sorts by: time in descending order.
    function(a, b) {
        return b.time - a.time
    }
)

// [3] RESPONSE HANDLING //
let prices = []

// gets: historical prices from the response
for (let i=0; i<HISTORICAL_DAYS; i++) {
    // then pushes them into the price array.
        prices.push(priceResponse[i].priceUsd)
}

// [4] PROMPT ENGINEERING //
const prompt = 
`Historical Data: ${prices}. Based off the historical data, use a ${FORECAST_METHOD} forecast to predict the price at the next timestamp in the time series.
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
        "Authorization": `Bearer ${API_KEY}`
    },
    // defines: data payload (request body as an object).
    data: {
        // AI model to use
        "model": "gpt-3.5-turbo",
        // messages: array of messages to send to the model
        "messages": [
        // role: role of the message sender (either "user" or "system")
        // content: message content (required)
        {
            "role": "system",
            "content": "You are forecasting the price of a token."
        },
        {
            "role": "user",
            "content": prompt
        }
    ]},
    // timeout: maximum request duration in ms (optional)
    timeout: 10_000,
    // maxTokens: maximum number of tokens to spend on the request (optional)
    maxTokens: 100,
    // responseType: expected response type (optional, defaults to 'json')
    responseType: "json",
    // params: URL query parameters supplied as an object (optional)
    params: {}
})

const response = await openAIRequest

// finds: the response and returns the result (as a string).
const stringResult = response.data?.choices[0].message.content
console.log(stringResult)

// note: if your result is a really small price, then update to your desired precision.
const numericResult = Number(stringResult).toFixed(PRECISION)
const result = numericResult.toString()

console.log(`${FORECAST_METHOD} price forecast: %s`, stringResult)

// challenge: add additional forecast methods and then averaging the results.

// console.log("Keys in Response Obj : ", Object.keys(response), "\n\n")
// console.log(" response.response : ", JSON.stringify(response.data?.choices[0].message.content))

return Functions.encodeString(result || "Failed")

// Note (on Response): source code MUST return a Buffer or the request will return an error message.
// Use one of the following functions to convert to a Buffer representing the response bytes that are returned to the consumer smart contract:
// - Functions.encodeUint256
// - Functions.encodeInt256
// - Functions.encodeString
// Or return a custom Buffer for a custom byte encoding