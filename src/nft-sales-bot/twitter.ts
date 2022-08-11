import { TwitterApi } from "twitter-api-v2";
import axios from "axios";

export const tweet = (tweetBd: any) => {
	return new Promise(async (resolve, reject) => {
		const client = new TwitterApi({
			appKey: "vVJp5ah3FiDzm4Zjk3f2aPkFw",
			appSecret: "zhuHl2rEDIkZfUcMB3YIwTVdIQ0127BWphXHwH5R7kkpMjmLNw",
			accessToken: "1536647596952981507-ds4faH1yZAnsbBqbAwymqqkjGs09Nv",
			accessSecret: "Req5UoNWk80izXXOyYRkjPmEvJdDMCAJWGrAkh9o4k84N",
		});

		try {
			const tokenId = tweetBd.tokenId > 2222 ? 196 : tweetBd.tokenId;
			const { data } = await axios.get(
				`https://everyday-goddesses.mypinata.cloud/ipfs/QmVWyCLkiBVKgFdaMD9aXy27uz5sip4EwTWSQx3Hb8XT8v/${tokenId}.png`,
				{
					responseType: "arraybuffer",
				}
			);
			const imageBuffer = Buffer.from(data);

			const mediaId = await client.v1.uploadMedia(imageBuffer, {
				mimeType: "Png",
			});

			await client.v2.tweetThread([
				{
					text: `Everyday Goddess #${
						tweetBd.tokenId
					} was adopted for ${
						tweetBd.value
					}Ξ by ${tweetBd.seller.substring(
						0,
						7
					)} from ${tweetBd.buyer.substring(0, 7)}`,
					media: { media_ids: [mediaId] },
				},
				{
					text: `https://opensea.io/assets/${tweetBd.contractAddress}/${tweetBd.tokenId}`,
				},
			]);

			resolve(1);
		} catch (e: any) {
			console.error(e.toString());
			reject(e.toString());
		}
	});
};
