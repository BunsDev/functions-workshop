// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

import { FunctionsClient } from "lib/chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import { ConfirmedOwner } from "lib/chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import { FunctionsRequest } from "lib/chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

/**
 * @title Chainlink Functions example on-demand consumer contract example
 */
contract FunctionsConsumer is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    // DON ID for the Functions DON to which the requests are sent
    bytes32 public donId;

    //////////////////////////// [D] ////////////////////////////

    // reports: latestForecast response.
    string public latestForecast;

    // emits: price forecast event.
    event ForecastedPrice(string latestForecast);

    // emits: OCRResponse event.
    event OCRResponse(bytes32 indexed requestId, bytes result, bytes err);

    //////////////////////////// [D] ////////////////////////////

    bytes32 public latestRequestId;
    bytes public latestResponse;
    bytes public latestError;

    constructor(
        address router,
        bytes32 _donId
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        donId = _donId;
    }

    /**
     * @notice Set the DON ID
     * @param newDonId New DON ID
     */
    function setDonId(bytes32 newDonId) external onlyOwner {
        donId = newDonId;
    }

    /**
     * @notice Triggers an on-demand Functions request using remote encrypted secrets
     * @param source JavaScript source code
     * @param secretsLocation Location of secrets (only Location.Remote & Location.DONHosted are supported)
     * @param encryptedSecretsReference Reference pointing to encrypted secrets
     * @param args String arguments passed into the source code and accessible via the global variable `args`
     * @param bytesArgs Bytes arguments passed into the source code and accessible via the global variable `bytesArgs` as hex strings
     * @param subscriptionId Subscription ID used to pay for request (FunctionsConsumer contract address must first be added to the subscription)
     * @param callbackGasLimit Maximum amount of gas used to call the inherited `handleOracleFulfillment` method
     */

    function sendRequest(
        string calldata source,
        FunctionsRequest.Location secretsLocation,
        bytes calldata encryptedSecretsReference,
        string[] calldata args,
        bytes[] calldata bytesArgs,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) external onlyOwner {
        FunctionsRequest.Request memory req;
        req.initializeRequest(
            FunctionsRequest.Location.Inline,
            FunctionsRequest.CodeLanguage.JavaScript,
            source
        );
        req.secretsLocation = secretsLocation;
        req.encryptedSecretsReference = encryptedSecretsReference;
        if (args.length > 0) {
            req.setArgs(args);
        }
        if (bytesArgs.length > 0) {
            req.setBytesArgs(bytesArgs);
        }
        latestRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            callbackGasLimit,
            donId
        );
    }

    /**
     * @notice Store latest result/error
     * @param requestId The request ID, returned by sendRequest()
     * @param response Aggregated response from the user code
     * @param err Aggregated error from the user code or from the execution pipeline
     * Either response or error parameter will be set, but never both
     */

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        latestResponse = response;
        latestError = err;

        //////////////////////////// [D] ////////////////////////////

        // updates: latest request id.
        latestRequestId = requestId;
        
        // emits: OCRResponse event.
        emit OCRResponse(requestId, response, err);

        // converts: latest response to a (human-readable) string.
        latestForecast = string(abi.encodePacked(response));
        emit ForecastedPrice(latestForecast);

        //////////////////////////// [D] ////////////////////////////
    }

}
