const helpMessage = `
*Commands*

/start - Activate the sleeping MidasBot.
/balance - View your token balances.
/contact - How to contact the Midas team.
/learn - Documents, guides, and resources for the Midas ecosystem.
/help - Everything you need to know.
/settings - Adjust your settings.`;

const contacts = `
<b>General Inquiries</b>: team@midas.app
<b>Investment Opportunities>/b>: invest@midas.app
`;

const botCommands = {
  "/start": "Wake up the sleeping MidasBot",
  "/contact":
    "Reach out to team@midas.app, and a team member will be with you shortly!",
  "/help": `Here's a list of all my capabilities, \n ${helpMessage}`,
  "/balance": "Your your balances: \n $xx.yy",
  "/buy": "",
  "/redeem": "",
  "/history": "Your full transaction history: \n",
  "/support": "",
  "/learn": "Learn more about the mTBILL and mBASIS tokens.",
};

const learnMessageHTML = `
<b>Here are some useful resources:</b>

📚 <i><b><a href=\"https://docs.midas.app/\">Documentation</a></b></i>
🌐 <i><b><a href=\"https://midas.app/\">Website</a></b></i>
✒️ <i><b><a href=\"https://midas.app/blog\">Blog</a></b></i>`;

const learnMessageMD = `
**Here are some useful resources:**

📚 [Documentation](https://docs.midas.app/)
🌐 [Site](https://midas.app/)
✒️ [Blog](https://midas.app/blog)`;

const responses = {
  hello: "Hi there! How can I help you?",
  help: `Sure, I'm here to help! You'll find a breakdown of my capabilities below. It's not much... but it's honest work. \n ${helpMessage}`,
  contact:
    "Send a message over to team@midas.app! The team will be right with you!",
  learn: learnMessageMD,
  // learn:
  //   "Here are some useful resources: [Documentation](https://docs.midas.app/), [Website](https://midas.app/), [Blog](https://midas.app/blog)",
};

module.exports = {
  helpMessage,
  learnMessageHTML,
  responses,
  botCommands,
  contacts,
};
