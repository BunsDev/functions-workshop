// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0;

import "lib/forge-std/src/Script.sol";
import "src/FunctionsConsumer.sol";

contract FunctionsConsumerScript is Script {

    function run() external {
        uint deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // REFER TO DOCS FOR UP-TO-DATE ADDRESSES
        // https://docs.chain.link/chainlink-functions/supported-networks

        address ROUTER_ADDRESS_AVAX = 0x9f82a6A0758517FD0AfA463820F586999AF314a0;
        bytes32 DON_ID_AVAX = 0x66756e2d6176616c616e6368652d6d61696e6e65742d31000000000000000000;

        FunctionsConsumer functionsConsumer = new FunctionsConsumer(
            ROUTER_ADDRESS_AVAX,    // address router,
            DON_ID_AVAX             // bytes32 _donId
        );

        // silences warning.
        functionsConsumer;

        vm.stopBroadcast();
    }
}