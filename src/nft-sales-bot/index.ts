// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import abi from "./erc721abi.json";
import BN from "bignumber.js";
import { createMessage, discordSetup } from "./discord";
import debug from "debug";
import axios from "axios";
import Logger from "./logger";

type TransferEvent = {
	returnValues: {
		from: string;
		to: string;
		tokenId: string;
	};
	transactionHash: string;
	blockNumber: number;
};

export type MetadataCb = (metadata: any) => {
	name: string;
	image: string;
};

type Options = {
	websocketURI: string;
	contractAddress: string;
	discordBotToken: string;
	discordChannelId: string;
};

const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2".toLowerCase();

async function nftSalesBot(options: Options) {
	Logger.info("INFO: BOT init started");
	const channel = await discordSetup(
		options.discordBotToken,
		options.discordChannelId
	);
	Logger.info("INFO: BOT init complete");
	const web3 = new Web3(
		new Web3.providers.WebsocketProvider(options.websocketURI, {
			clientConfig: {
				keepalive: true,
				keepaliveInterval: 60000,
			},
			reconnect: {
				auto: true,
				delay: 5000, // ms
				maxAttempts: 25,
				onTimeout: false,
			},
		})
	);

	const contract = new web3.eth.Contract(
		abi as unknown as AbiItem,
		options.contractAddress
	);

	async function transferCallback(res: TransferEvent) {
		Logger.info("INFO: Transfer Event Recieved");
		const tx = await web3.eth.getTransaction(res.transactionHash);
		Logger.info("INFO: BOT started");

		const txReceipt = await web3.eth.getTransactionReceipt(
			res.transactionHash
		);
		let wethValue = new BN(0);
		Logger.info(`INFO: tx.recipet ${JSON.stringify(txReceipt)}`);

		txReceipt?.logs.forEach((currentLog: any) => {
			// check if WETH was transferred during this transaction
			if (
				currentLog.topics[2]?.toLowerCase() ==
					web3.utils
						.padLeft(res.returnValues.from, 64)
						.toLowerCase() &&
				currentLog.address.toLowerCase() == WETH_ADDRESS &&
				currentLog.topics[0]?.toLowerCase() ==
					"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef".toLowerCase()
			) {
				const v = `${parseInt(currentLog.data)}`;
				Logger.info(`INFO: Weth value found ${v}`);
				wethValue = wethValue.plus(web3.utils.fromWei(v));
			}
		});
		let value = new BN(web3.utils.fromWei(tx.value));
		Logger.info(
			`INFO: WETH Value: ${wethValue.toFixed()}, ETH Value: ${value.toFixed()}`
		);

		value = value != undefined && value.gt(0) ? value : wethValue;
		if (value != undefined && value.gt(0)) {
			const uri = await contract.methods
				.uri(res.returnValues.tokenId)
				.call();
			Logger.info(`INFO: URI is ${uri}}`);
			const { data } = await axios.get(uri);
			Logger.info(`INFO: Data ${data.name} - ${data.image}}`);
			const block = await web3.eth.getBlock(res.blockNumber);
			const message = createMessage(
				{
					name: data.name,
					image: data.image,
				},
				value.toFixed(),
				res.returnValues.to,
				res.returnValues.from,
				block.timestamp,
				options.contractAddress,
				res.returnValues.tokenId
			);

			try {
				await channel.send({ embeds: [message] });
			} catch (e: any) {
				Logger.error(
					`ERROR Index-116: Error sending message ${e.message}`
				);
			}
		}
	}

	contract.events.TransferSingle(async (err: any, res: TransferEvent) => {
		if (!err) {
			await transferCallback(res);
		}
	});

	return {
		test: transferCallback,
	};
}

export default nftSalesBot;
