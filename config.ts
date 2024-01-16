import dotenv from "dotenv";
dotenv.config();

const BASE_URI = process.env.BASE_URI;
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;

export const config = { // This is the config file for the RevoAPI. You can change the port, the timeout, and the application name, version, description, and owners.
    application: {
        name: "CDN",
        version: "1.0.0",
        description: `The RevochatAPI is a REST API that allows you to interact with the Revochat database.`,
        owners : [
            "ByLife",
            "Thomas78125",
            "Lux",
        ],
    }, 

    properties : {
        port: Number(process.env.APP_PORT) || 3000,
        readyEventTimeout: 500,
    },
    mongo: {
        username: MONGO_USERNAME,
        url: (process.env.MONGO_URL?.replace("<USERNAME>", MONGO_USERNAME!).replace("<PASSWORD>", MONGO_PASSWORD!))!,
    },
    api : {
        url : BASE_URI,
        version : "0.6.9",
    },
    ascii: {
        art: `
        _______                                           __                    __     
        /       \                                         /  |                  /  |    
        $$$$$$$  |  ______   __     __  ______    _______ $$ |____    ______   _$$ |_   
        $$ |__$$ | /      \ /  \   /  |/      \  /       |$$      \  /      \ / $$   |  
        $$    $$< /$$$$$$  |$$  \ /$$//$$$$$$  |/$$$$$$$/ $$$$$$$  | $$$$$$  |$$$$$$/   
        $$$$$$$  |$$    $$ | $$  /$$/ $$ |  $$ |$$ |      $$ |  $$ | /    $$ |  $$ | __ 
        $$ |  $$ |$$$$$$$$/   $$ $$/  $$ \__$$ |$$ \_____ $$ |  $$ |/$$$$$$$ |  $$ |/  |
        $$ |  $$ |$$       |   $$$/   $$    $$/ $$       |$$ |  $$ |$$    $$ |  $$  $$/ 
        $$/   $$/  $$$$$$$/     $/     $$$$$$/   $$$$$$$/ $$/   $$/  $$$$$$$/    $$$$/                                                                                
        `
    }
}