const TelegramBot = require("node-telegram-bot-api");
const natural = require("natural");
const { getUserBalance } = require("./wallet/jetton.js"); 
const {
  learnMessageHTML,
  helpMessage,
  responses,
  contacts,
} = require("./commands/commands.js");
require("dotenv").config();

const formatBalanceMessage = (balanceInfo) => {
  const { balanceInTONs, addressInfo } = balanceInfo;
  return `<b>Address Information:</b> \n
  <b>Balance:</b> ${balanceInTONs} TON
  <b>State:</b> ${addressInfo.state}
  <b>Last Transaction ID:</b> ${addressInfo.last_transaction_id.lt}
  <b>Block ID:</b> ${addressInfo.block_id.seqno}
  `;
};

const API_KEY = process.env.TELEGRAM_API; 
const walletAddress = "UQB1sdpSCZAMjkZp6Oqq5FN0qREd-migbTZSLtRs3aLefECx";

// init msg tokenization
const tokenizer = new natural.WordTokenizer(); 

// function to handle auto responses for matched tokens
async function getResponse(message) {
  const tokens = tokenizer.tokenize(message.toLowerCase());
  console.log(`Tokens: ${tokens}`);

  for (const token of tokens) {
    if (responses[token]) {
      console.log(`Matched token: ${token}`);
      return responses[token];
    }
  }
  return null;
}

//// ~~~~~ BOT LOGIC ~~~~~ ////

let bot;

try {
  bot = new TelegramBot(API_KEY, { polling: true });

  bot.on("polling_error", (error) => {
    console.error(`Polling error: ${error.code} - ${error.message}`);
  });

  // matches "/echo [whatever]"
  bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];

    bot.sendMessage(chatId, resp);
  });

  // listen for any kind of msg
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text ? msg.text.toLowerCase() : "";

    if (!messageText.trim()) {
      console.log("Received an empty message, ignoring.");
      return;
    }
    // auto reponse imp 
    const response = await getResponse(messageText);
        
    if (response) {
      bot.sendMessage(chatId, response, { parse_mode: "Markdown" });
    } else {
      console.log("No response found for the given message.");
    }
    // bot.sendMessage(chatId, response, { parse_mode: "Markdown" });

    // Process inc msg
    if (messageText === "/start") {
      // if private continue, else send link
      if (msg.chat.type === "private") {
        bot.sendMessage(
          chatId,
          "Welcome to MidasBot! What can I do for you today?",
          {
            "reply_markup": {
              "inline_keyboard": [ // keyboard button opts
                [{ text: "Help", callback_data: "help" }],
                [{ text: "Learn", callback_data: "learn" }],
                [{ text: "Contacts", callback_data: "contacts" }]
                [{ text: "Balance", callback_data: "balance" }]
              ],
              resize_keyboard: true,
              one_time_keyboard: true,
            },
          }
        );
      } else {
        const privateChatLink = `https://t.me/MidasChatBot`;
        bot.sendMessage( // if not in private, send link to start
            chatId,
            `Please start a private chat with me by clicking [here](${privateChatLink}).`,
            { parse_mode: 'Markdown' }
        );
      }
      return; 
    }
    
    // handle /learn
    if (messageText === "/learn") {
      bot.sendMessage(chatId, learnMessageHTML, { parse_mode: 'HTML'});
    }
    // handle /help
    if (messageText === "/help") {
      bot.sendMessage(chatId, helpMessage, { parse_mode: "Markdown"});
    }
    if (messageText === "/contacts") {
      bot.sendMessage(chatId, contacts, { parse_mode: 'HTML'});
    }
    if (messageText.startsWith("hi")) {
      bot.sendMessage(
        chatId,
        `Hello, ${msg.from.first_name}. How can I help you? Type /start to get started!`,
        {
          parse_mode: "Markdown",
        }
      );
    }
    // handle balance querying -- pulls from random address currently
    if (messageText === "/balance") {
      getUserBalance(walletAddress)
        .then((balanceInfo) => {
          const balanceMessage = formatBalanceMessage(balanceInfo);
          bot.sendMessage(chatId, balanceMessage, { parse_mode: 'HTML'});
        })
        .catch((error) => {
          console.error(`Failed to get balance: ${error.message}`);
          bot.sendMessage(
            chatId,
            `Failed to get balance: ${error.message}`
          );
        });
    }
    // if (chatId === 4236340940) { // 
    //   if (messageText.includes("contact")) {
    //     bot.sendMessage(chatId, responses.contact);
    //   }
    //   if (messageText.includes("help")) {
    //     bot.sendMessage(chatId, responses.help, { parse_mode: "Markdown" });
    //   }
    //   if (messageText.includes("learn")) {
    //     bot.sendMessage(chatId, responses.learn, { parse_mode: "HTML" });
    //   } 
    // }

  });

  // handle button callbacks
  bot.on("callback_query", (callbackQuery) => {
    const message = callbackQuery.message;
    const data = callbackQuery.data;

    console.log(`Callback query data: ${data}`); // Log the callback data for debugging

    if (data === "help") {
      bot.sendMessage(message.chat.id, helpMessage, {
        parse_mode: "Markdown",
      });
    } else if (data === "learn") {
      bot.sendMessage(message.chat.id, learnMessageHTML, {
        parse_mode: "HTML",
      });
    } else if (data === "contacts") {
      bot.sendMessage(message.chat.id, "Contact us at team@midas.app");
    } else if (data === "balance") {
      bot.sendMessage(message.chat.id, );
    }
    // Acknowledge the callback query
    bot.answerCallbackQuery(callbackQuery.id);
  });
} catch (error) {
  console.error(`Failed to initialize bot: ${error.message}`);
  process.exit(1);
}
