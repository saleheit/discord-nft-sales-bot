import nftSalesBot from ".";
nftSalesBot({
    // Websocket connection to Ethereum)
    websocketURI: process.env.WEBSOCKET_URI || "wss://mainnet.infura.io/ws/v3/3b235c9c3401422186d656b667967034",
  
    // NFT smart contract address
    contractAddress: process.env.CONTRACT_ADDRESS || '0xf220db48f0d3ca8a9833e0353e7497dbceae7ac6',
  
    // Bot token set up in Discord developer portal
    discordBotToken: process.env.DISCORD_BOT_TOKEN || 'OTc0NjE5OTcyNjQwODYyMjQ4.G1tLVa.2sJBXTAnG8eLe1ihxRbZ73ibkIE-uvvaVABEPs',
  
    // ID of channel (turn on Developer mode in Discord to get this)
    discordChannelId: process.env.DISCORD_CHANNEL_ID || '627735647142281250',

    //metadataCb: (nft) => {return {name: "SHINY", image: "https://shiny-nft.com/assets/images/logo.svg"} }
  }).catch((e) => {
    // something went wrong
    console.error("Error", e.toString())
  });