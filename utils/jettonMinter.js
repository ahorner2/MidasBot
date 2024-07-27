const TonWeb = require("tonweb");
require("dotenv").config();

const TONCENTER_API = process.env.TONCENTER_API;

const tonweb = new TonWeb(
  new TonWeb.HttpProvider("https://toncenter.com/api/v2/jsonRPC", {
    apiKey: TONCENTER_API,
  })
);

const getJettonMinterData = async (minterAddress) => {
  try {
    const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {
      address: minterAddress,
    });

    const data = await jettonMinter.getData();
    return data;
  } catch (error) {
    console.error(
      "An error occurred while fetching JettonMinter data:",
      error.message
    );
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

module.exports = { getJettonMinterData };
