process.env.NTBA_FIX_319 = 1;
const TelegramBot = require("node-telegram-bot-api");
const { Configuration, OpenAIApi } = require("openai");
const { gameOptions, againOptions } = require("./options.js");
// const token = ''; // OLD BOT TOKEN
const token = ""; // GeekRick_Bot

//======================================================================================================
//======================================================================================================

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

const configuration = new Configuration({
	apiKey: "",
});
const openai = new OpenAIApi(configuration);

//======================================================================================================
const chats = [];

//===================================bot commands=======================================================
bot.setMyCommands([
	{ command: "/start", description: "Hey dude!" },
	{ command: "/info", description: "Any problems?" },
	{ command: "/game", description: "Let's play if you don't piss?" },
]);

//======================================================================================================
const startGame = async (chatId) => {
	await bot.sendSticker(chatId, "./assets/dontBeSHyRick.webp");
	const randomNumber = Math.floor(Math.random() * 10);
	chats[chatId] = randomNumber;
	await bot.sendMessage(chatId, `What is the number???`, gameOptions);
};


//======================================================================================================
// Listen for any kind of message. There are different kinds of
// messages.
const start = () => {
	bot.on("message", async (msg) => {
		const text = msg.text;
		const chatId = msg.chat.id;
		if (text === "/start") {
			await bot.sendSticker(chatId, "./assets/helloRick.webp");
			return await bot.sendMessage(chatId, `Hi, ${msg.from.first_name} ${msg.from.last_name}!`);
		}
		console.log(msg);
		if (text === "/info") {
			await bot.sendSticker(chatId, "./assets/bitchRick.webp");
			return await bot.sendMessage(chatId, `How can I help you?`);
		}
		if (text === "/game") {
			return startGame(chatId);
		}
		await bot.sendSticker(chatId, "./assets/tryAgaingRick.webp");
		// return await bot.sendMessage(chatId, `${msg.from.first_name}, what the fuck???`);
	});

	bot.on("callback_query", async (msg) => {
		const data = msg.data;
		const chatId = msg.message.chat.id;

		if (data === "/again") {
			return await startGame(chatId);
		}
		if (data == chats[chatId]) {
			await bot.sendSticker(chatId, `./assets/wubadaRick.webp`);
			return await bot.sendMessage(chatId, `You win - ${chats[chatId]}???`, againOptions);
		} else {
			await bot.sendSticker(chatId, `./assets/boredRick.webp`);
			return await bot.sendMessage(chatId, `LOOOSER - ${chats[chatId]}!`, againOptions);
		}
	});

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const message = msg.text;
        
        // Use the OpenAI API to generate a response to the user's message
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: message,
            temperature: 0.7,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        console.log(response);
        
        // Send the response back to the user
        bot.sendMessage(chatId, response.data.choices[0].text);
      });
      
};
start();
//======================================================================================================
//======================================================================================================
