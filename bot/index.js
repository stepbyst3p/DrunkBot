const TelegramBot = require("node-telegram-bot-api");
const request = require("request");
const token = "460387748:AAG62Hlk3qCTKuY_KnZ-7CygPmp0V6-kmPQ";
const bot = new TelegramBot(token, { polling: true });
const emoji = require("node-emoji").emoji;
const headers = {
  "User-Agent": "Super Agent/0.0.1",
  "Content-Type": "application/x-www-form-urlencoded"
};

const options = {
  url: "http://localhost:8000/bars",
  method: "POST",
  headers: headers,
  form: { lat: "xxx", lng: "yyy" }
};

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on("message", msg => {
  const chatId = msg.chat.id;
  console.log(msg.location);
  request(options, function(error, response, body) {
    if (!error) {
      const bars = JSON.parse(body);
      // console.log(bars);

      let options = {
        reply_markup: JSON.stringify({
          keyboard: bars.map(bar => {
            const button = [
              {
                text: emoji.beer + bar.title,
                callback_data: bar.barId
              }
            ];
            console.log(button);
            return button;
          })
        })
      };
      bot
        .sendMessage(chatId, "Ближайшие бары в радиусе 5 километров:", options)
        .then(() => {
          bot.once("message", answer => {
            console.log({ answer });
          });
        });
    } else {
      console.log(error);
    }
  });
});
