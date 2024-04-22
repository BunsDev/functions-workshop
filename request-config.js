const fs = require("fs")
const { Location, ReturnType, CodeLanguage } = require("@chainlink/functions-toolkit")

// configures request: via settings  in the fields below
const requestConfig = {

    // source code location (inline only)
    codeLocation: Location.Inline,
    
    // (optional) if secrets are expected in the sourceLocation of secrets (only Remote or DONHosted is supported)
    // secretsLocation: Location.Inline,
    secretsLocation: Location.DONHosted,
    
    // source code to be executed (todo: update)
    // source: fs.readFileSync("./calculation-example.js").toString(),
    // source: fs.readFileSync("./api-request.js").toString(),
    source: fs.readFileSync("./api-request.js").toString(),

    // (optional) accessed within the source code with `secrets.varName` (ie: secrets.apiKey). The secrets object can only contain string values.
    secrets: { 
        apiKey: process.env.OPENAI_KEY
    },

    // args (array[""]): source code accesses via `args[index]`.
    args: [
        "bitcoin",          // tokenId
        "d1",               // interval
        "forecastMethod",   // forecast_method
        // "",              // AI prompt
    ],

    // code language (JavaScript only)
    codeLanguage: CodeLanguage.JavaScript,

    // shows: expected type of the returned value.
    // expectedReturnType: ReturnType.uint256,
    expectedReturnType: ReturnType.string,
}

module.exports = requestConfig