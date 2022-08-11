import nftSalesBot from "./nft-sales-bot";
import * as dotenv from "dotenv";
import Logger from "./nft-sales-bot/logger";
dotenv.config();

nftSalesBot({
	// Websocket connection to Ethereum)
	websocketURI: process.env.WEBSOCKET_URI ?? "",
	// NFT smart contract address
	contractAddress: process.env.CONTRACT_ADDRESS ?? "",
	// Bot token set up in Discord developer portal
	discordBotToken: process.env.DISCORD_BOT_TOKEN ?? "",
	// ID of channel (turn on Developer mode in Discord to get this)
	discordChannelId: process.env.DISCORD_CHANNEL_ID ?? "",
}).catch((e) => {
	// something went wrong
	Logger.error(`ERROR Serve-17: Error sending message ${e.message}`);
});
