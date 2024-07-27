const { TonClient } = require("@eversdk/core");
const { libNode } = require("@eversdk/lib-node");

require("dotenv").config(); 
require("buffer");
TonClient.useBinaryLibrary(libNode);

// Queries balance of particular contract. Using a dummy here,
// but address would be grabbed on connection or interaction

const SECRET = process.env.KEY; 

const client = new TonClient({
  network: {
    endpoints: [
      "https://mainnet.evercloud.dev/33db20514ec84613bd2bbf166a07be4c/graphql",
      "wss://mainnet.evercloud.dev/33db20514ec84613bd2bbf166a07be4c/graphql",
    ],
    access_key: SECRET
  },
});


const CONTRACT_ADDRESS = "UQB1sdpSCZAMjkZp6Oqq5FN0qREd-migbTZSLtRs3aLefECx"; // Old TON Foundation wallet for testing
const CONTRACT_ADDRESS2 = "EQAFmjUoZUqKFEBGYFEMbv-m61sFStgAfUR8J6hJDwUU09iT"; // TON Foundation wallet for testing
const CONTRACT_ADDRESS2a = "0:059a3528654a8a14404660510c6effa6eb5b054ad8007d447c27a8490f0514d3"; // TON Foundation wallet for testing

async function getUserBalance() {
  const address = CONTRACT_ADDRESS2a;
  console.log(`Parsed address: ${address}`);
  
  try {
    queryString = `
      query{
        accounts(
          filter: {
            id: {eq: "${address}"}
          }
       )  {
          id 
          balance
          }
      }
    `;

    console.log("Getting balance...");
    const response = await client.net.query({
      query: queryString,
    });

    const accounts = response.result.data.accounts;
    if (accounts.length === 0) {
      throw new Error("Account not found");
    }

    const { id, balance } = accounts[0];
    console.log(`Account ID: ${id}`);
    console.log(`Balance retrieved: ${BigInt(balance)}`);

    // Check if balance is in hexadecimal and convert it to decimal
    let balanceInTONs;
    if (balance.startsWith("0x")) {
      balanceInTONs = BigInt(balance) / BigInt(1e9);
    } else {
      balanceInTONs = BigInt(balance) / BigInt(1e9);
    }
    console.log(`Balance in TONs: ${balanceInTONs}`);

    return balanceInTONs;
  } catch (error) {
    console.error(`Failed to get balance: ${error.message}`);
    throw new Error(`Failed to get balance: ${error.message}`);
  }
}

module.exports = { getUserBalance };
