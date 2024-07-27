const TonWeb = require("tonweb");
require("dotenv").config();

const TONCENTER_API = process.env.TONCENTER_API;

const tonweb = new TonWeb(
  new TonWeb.HttpProvider("https://toncenter.com/api/v2/jsonRPC", {
    apiKey: TONCENTER_API,
  })
);

const getUserBalance = async (walletAddress) => {
  try {

    const addressBalance = await tonweb.getBalance(walletAddress);
    const addressInfo = await tonweb.provider.getAddressInfo(walletAddress);

    const balanceInTONs = parseFloat(addressBalance / 1e9).toFixed(2);
    console.log(`Balance in TONs: ${balanceInTONs}`);

    return {
      balanceInTONs,
      addressInfo,
    };
  } catch (error) {
    console.error("An error occurred:", error.message);
    if (error.result) {
      console.error(
        "Detailed error result:",
        JSON.stringify(error.result, null, 2)
      );
    } else {
      console.error("Full error object:", error);
    }
    throw error;
  }
};

module.exports = { getUserBalance };
