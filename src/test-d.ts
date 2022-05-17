import { createMessage, discordSetup } from "./discord";

async function go() {
    const channel = await discordSetup(
        'OTc0NjE5OTcyNjQwODYyMjQ4.G1tLVa.2sJBXTAnG8eLe1ihxRbZ73ibkIE-uvvaVABEPs',
        '627735647142281250'
    );
    
    const message = createMessage(
        {
            name: "SHINY", 
            image: "https://shiny-nft.com/assets/images/logo.svg"
        },
        "12",
        "LUKA",
        "SALEH",
        new Date().toTimeString(),
        "BAMWHAT",
        "TOKENWHAT"
    );

    console.log("Try sending message");
    
    try {
        await channel.send({ embeds: [message] });
    } catch (e: any) {
        console.error("Error sending message", " ", e.message);
    }
}

go();