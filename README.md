# Block Magic Functions Workshop
In this workshop, we will build a price forecast to help inform the direction of a trade transaction.

## Getting Started
- [Install Foundry and Rust](/docs/INSTALL.md)
- [Foundry Guide](/docs/FOUNDRY.md)

## Overview of Functions
Chainlink functions enables you to leverage the power of a decentralized oracle network (DON) to execute external function calls (off-chain) to inform on-chain interactions.

Chainlink is able to execute a user-defined function via a DON, which comes to consensus on the results and reports the median result to the requesting contract via a callback function.

---


## Functions Workflow

### 1. Setup Environment Variables

#### Create Password
Chainlink Functions enables you to securely share secrets with the DON. Secrets are encrypted with a password.
```
yarn set:pw
```
Once the ecrpytion key is created with your desired password, you can safely share your secrets with the DON, which requires multiple nodes to decrypt with consensus.

#### Store Variables

We may now safely store environment variables without worrying about them being exposed, since they will be encrypted with your desired password. 

These variables will be stored in a file called `.env.enc`.

```
yarn set:env
```
After running the command, you'll be prompted to enter the following for each variable to be encrypted:

- **Name**: used to identify the variable.

- **Value**: your (*unencrypted*) environment variable (*secret*).

For this demonstration, you will need to add `OPENAI_KEY` to your encrypted environment variables.


### 2. Simulate Functions
Before deploying, it's useful to simulate the execution of your function to ensure the output of your function execution is as expected.

You may simulate your function using the command below.

```
yarn simulate
```

### 3. Deploy Consumer

```
yarn deploy
```

**Note**: ensure you have updated the deployment script to align with your target blockchain configurations. Also, be sure to update the RPC URL that is specified within the script, which is currently set to the RPC corresponding to Avalanche C-Chain.