import { format } from "date-fns";
import Discord, { Intents, TextChannel } from "discord.js";

export const discordSetup = (
	discordBotToken: string,
	discordChannelId: string
): Promise<TextChannel> => {
	const discordBot = new Discord.Client({
		intents: [Intents.FLAGS.GUILD_MESSAGES],
	});
	return new Promise<TextChannel>((resolve, reject) => {
		discordBot.login(discordBotToken);
		discordBot.on("ready", async () => {
			const channel = await discordBot.channels.fetch(discordChannelId);
			resolve(channel as TextChannel);
		});
	});
};

export const createMessage = (
	metadata: { name: string; image: string },
	value: string,
	buyer: string,
	seller: string,
	timestamp: string | number,
	contractAddress: string,
	tokenId: string
) =>
	new Discord.MessageEmbed()
		.setColor("#AFBEF6")
		.setTitle(`${metadata.name} sold!`)
		.setAuthor(
			"Shiny NFT",
			"https://i.imgur.com/reaFWsR.png",
			"https://shiny-nft.com/"
		)
		.addFields(
			{ name: "Name", value: metadata.name, inline: true },
			{ name: "Amount", value: `${value} Ξ`, inline: true },
			{
				name: "Sold at",
				value: format(
					new Date(parseInt(timestamp as string) * 1000),
					"MMM do y h:mm a"
				),
				inline: true,
			},
			{ name: "Buyer", value: buyer },
			{ name: "Seller", value: seller }
		)
		.setURL(`https://opensea.io/assets/${contractAddress}/${tokenId}`)
		.setThumbnail(
			`https://everyday-goddesses.mypinata.cloud/ipfs/QmVWyCLkiBVKgFdaMD9aXy27uz5sip4EwTWSQx3Hb8XT8v/${tokenId}.png`
		);
