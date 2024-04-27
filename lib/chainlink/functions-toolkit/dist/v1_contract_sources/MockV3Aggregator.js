"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockV3AggregatorSource = void 0;
exports.MockV3AggregatorSource = {
    _format: 'hh-sol-artifact-1',
    contractName: 'MockV3Aggregator',
    sourceName: 'MockV3Aggregator.sol',
    abi: [
        {
            inputs: [
                {
                    internalType: 'uint8',
                    name: '_decimals',
                    type: 'uint8',
                },
                {
                    internalType: 'int256',
                    name: '_initialAnswer',
                    type: 'int256',
                },
            ],
            stateMutability: 'nonpayable',
            type: 'constructor',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'int256',
                    name: 'current',
                    type: 'int256',
                },
                {
                    indexed: true,
                    internalType: 'uint256',
                    name: 'roundId',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'updatedAt',
                    type: 'uint256',
                },
            ],
            name: 'AnswerUpdated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: 'uint256',
                    name: 'roundId',
                    type: 'uint256',
                },
                {
                    indexed: true,
                    internalType: 'address',
                    name: 'startedBy',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'startedAt',
                    type: 'uint256',
                },
            ],
            name: 'NewRound',
            type: 'event',
        },
        {
            inputs: [],
            name: 'decimals',
            outputs: [
                {
                    internalType: 'uint8',
                    name: '',
                    type: 'uint8',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'description',
            outputs: [
                {
                    internalType: 'string',
                    name: '',
                    type: 'string',
                },
            ],
            stateMutability: 'pure',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'getAnswer',
            outputs: [
                {
                    internalType: 'int256',
                    name: '',
                    type: 'int256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint80',
                    name: '_roundId',
                    type: 'uint80',
                },
            ],
            name: 'getRoundData',
            outputs: [
                {
                    internalType: 'uint80',
                    name: 'roundId',
                    type: 'uint80',
                },
                {
                    internalType: 'int256',
                    name: 'answer',
                    type: 'int256',
                },
                {
                    internalType: 'uint256',
                    name: 'startedAt',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'updatedAt',
                    type: 'uint256',
                },
                {
                    internalType: 'uint80',
                    name: 'answeredInRound',
                    type: 'uint80',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'getTimestamp',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'latestAnswer',
            outputs: [
                {
                    internalType: 'int256',
                    name: '',
                    type: 'int256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'latestRound',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'latestRoundData',
            outputs: [
                {
                    internalType: 'uint80',
                    name: 'roundId',
                    type: 'uint80',
                },
                {
                    internalType: 'int256',
                    name: 'answer',
                    type: 'int256',
                },
                {
                    internalType: 'uint256',
                    name: 'startedAt',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'updatedAt',
                    type: 'uint256',
                },
                {
                    internalType: 'uint80',
                    name: 'answeredInRound',
                    type: 'uint80',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'latestTimestamp',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'int256',
                    name: '_answer',
                    type: 'int256',
                },
            ],
            name: 'updateAnswer',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint80',
                    name: '_roundId',
                    type: 'uint80',
                },
                {
                    internalType: 'int256',
                    name: '_answer',
                    type: 'int256',
                },
                {
                    internalType: 'uint256',
                    name: '_timestamp',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_startedAt',
                    type: 'uint256',
                },
            ],
            name: 'updateRoundData',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'version',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
    ],
    bytecode: '0x608060405234801561001057600080fd5b506040516105113803806105118339818101604052604081101561003357600080fd5b5080516020909101516000805460ff191660ff84161790556100548161005b565b50506100a2565b600181815542600281905560038054909201808355600090815260046020908152604080832095909555835482526005815284822083905592548152600690925291902055565b610460806100b16000396000f3fe608060405234801561001057600080fd5b50600436106100d45760003560e01c80638205bf6a11610081578063b5ab58dc1161005b578063b5ab58dc14610273578063b633620c14610290578063feaf968c146102ad576100d4565b80638205bf6a146101db5780639a6fc8f5146101e3578063a87a20ce14610256576100d4565b806354fd4d50116100b257806354fd4d501461014e578063668a0f02146101565780637284e4161461015e576100d4565b8063313ce567146100d95780634aa2011f146100f757806350d25bcd14610134575b600080fd5b6100e16102b5565b6040805160ff9092168252519081900360200190f35b6101326004803603608081101561010d57600080fd5b5069ffffffffffffffffffff81351690602081013590604081013590606001356102be565b005b61013c61030b565b60408051918252519081900360200190f35b61013c610311565b61013c610316565b61016661031c565b6040805160208082528351818301528351919283929083019185019080838360005b838110156101a0578181015183820152602001610188565b50505050905090810190601f1680156101cd5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61013c610353565b61020c600480360360208110156101f957600080fd5b503569ffffffffffffffffffff16610359565b604051808669ffffffffffffffffffff1681526020018581526020018481526020018381526020018269ffffffffffffffffffff1681526020019550505050505060405180910390f35b6101326004803603602081101561026c57600080fd5b5035610392565b61013c6004803603602081101561028957600080fd5b50356103d9565b61013c600480360360208110156102a657600080fd5b50356103eb565b61020c6103fd565b60005460ff1681565b69ffffffffffffffffffff90931660038181556001849055600283905560009182526004602090815260408084209590955581548352600581528483209390935554815260069091522055565b60015481565b600081565b60035481565b60408051808201909152601f81527f76302e362f74657374732f4d6f636b563341676772656761746f722e736f6c00602082015290565b60025481565b69ffffffffffffffffffff8116600090815260046020908152604080832054600683528184205460059093529220549293919290918490565b600181815542600281905560038054909201808355600090815260046020908152604080832095909555835482526005815284822083905592548152600690925291902055565b60046020526000908152604090205481565b60056020526000908152604090205481565b6003546000818152600460209081526040808320546006835281842054600590935292205483909192939456fea2646970667358221220322084388f0143aa385982691acf5098e574be38d1e32ad302b12740d00ea1fe64736f6c63430007000033',
    deployedBytecode: '0x608060405234801561001057600080fd5b50600436106100d45760003560e01c80638205bf6a11610081578063b5ab58dc1161005b578063b5ab58dc14610273578063b633620c14610290578063feaf968c146102ad576100d4565b80638205bf6a146101db5780639a6fc8f5146101e3578063a87a20ce14610256576100d4565b806354fd4d50116100b257806354fd4d501461014e578063668a0f02146101565780637284e4161461015e576100d4565b8063313ce567146100d95780634aa2011f146100f757806350d25bcd14610134575b600080fd5b6100e16102b5565b6040805160ff9092168252519081900360200190f35b6101326004803603608081101561010d57600080fd5b5069ffffffffffffffffffff81351690602081013590604081013590606001356102be565b005b61013c61030b565b60408051918252519081900360200190f35b61013c610311565b61013c610316565b61016661031c565b6040805160208082528351818301528351919283929083019185019080838360005b838110156101a0578181015183820152602001610188565b50505050905090810190601f1680156101cd5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61013c610353565b61020c600480360360208110156101f957600080fd5b503569ffffffffffffffffffff16610359565b604051808669ffffffffffffffffffff1681526020018581526020018481526020018381526020018269ffffffffffffffffffff1681526020019550505050505060405180910390f35b6101326004803603602081101561026c57600080fd5b5035610392565b61013c6004803603602081101561028957600080fd5b50356103d9565b61013c600480360360208110156102a657600080fd5b50356103eb565b61020c6103fd565b60005460ff1681565b69ffffffffffffffffffff90931660038181556001849055600283905560009182526004602090815260408084209590955581548352600581528483209390935554815260069091522055565b60015481565b600081565b60035481565b60408051808201909152601f81527f76302e362f74657374732f4d6f636b563341676772656761746f722e736f6c00602082015290565b60025481565b69ffffffffffffffffffff8116600090815260046020908152604080832054600683528184205460059093529220549293919290918490565b600181815542600281905560038054909201808355600090815260046020908152604080832095909555835482526005815284822083905592548152600690925291902055565b60046020526000908152604090205481565b60056020526000908152604090205481565b6003546000818152600460209081526040808320546006835281842054600590935292205483909192939456fea2646970667358221220322084388f0143aa385982691acf5098e574be38d1e32ad302b12740d00ea1fe64736f6c63430007000033',
    linkReferences: {},
    deployedLinkReferences: {},
};
