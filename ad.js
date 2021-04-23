const mineflayer = require('mineflayer');
const valid_minehut_ranks = ['[VIP]', '[PRO]', '[LEGEND]', '[PATRON]', '[HELPER]', '[MOD]', '[SR.MOD]', '[DEV]', '[ADMIN]'];
const illegal_chars = [`§a`, `§b`, `§c`, `§d`, `§e`, `§f`, `§g`, `§k`, `§l`, `§m`, `§n`, `§o`, `§r`, `§0`, `§1`, `§2`, `§3`, `§4`, `§5`, `§6`, `§7`, `§8`, `§9`, `?`, `!`];
const discord = require('discord.js');
const dc_bot = new discord.Client();
const mongo = require('./mongoose.js');
const server_model = require('./server_model.js');
const advert_model = require('./advert_model.js');
let account_Mqdelyn0 = [`clvssicgabe@gmail.com`, `yawyannisbest1!`];
let account_IlyMqdelyn0 = [`officialronski@gmail.com`, `ItzRonSki13!`];
let bot = mineflayer.createBot({
    host: "minehut.com",
    username: account_Mqdelyn0[0],
    password: account_Mqdelyn0[1],
    port: 25565,
    version: "1.8.9",
    auth: "mojang",
});

dc_bot.login('ODMyNzI3MTUxNjg1MDA5NDc4.YHn_mA.XFqI8T0BcaekBl-MMXZn3-Dslak');
mongo.init();

dc_bot.on('ready', () => {
    dc_bot.user.setPresence({
        activity: {
            name: `over advertisements!`,
            type: `WATCHING`
        },
        status: 'online'
    })
});

dc_bot.on('error', async(error) => {
    console.log(`Threw an error.\n${error}`);
})

dc_bot.on('disconnect', async(error) => {
    console.log(`Threw an error.\n${error}`);
})

bot.on('login', () => {
    console.log(`Logged on Minehut with ${bot.username}!`);
});

bot.on(`error`, (error) => {
    console.log(error);
})

bot.on(`kicked`, (error) => {
    console.log(error);
    bot.connect({
        host: "minehut.com"
    });
})

bot.on('message', async(message) => {
    let message_joined = '';
    let server, rank, userr, user, type;
    let json = message.json.extra;
    type = 1;
    if(!json) { 
        json = message.json;
        type = 2;
    }
    if(json) {
        if(type === 1) {
            let messages = json.length;
            for(let num = 0; num < messages; num++) {
                message_joined = message_joined + json[num].text;
            }
        } else if(type === 2) {
            message_joined = json.text;
            if(message_joined.includes(`§`)) {
                while(message_joined.includes(`§`)) {
                    for(let colour_code of illegal_chars) {
                        message_joined = message_joined.replace(`${colour_code}`, ``);
                    }
                }
            }
        }
        if(message_joined.toUpperCase().startsWith(`[AD]`)) {
            let data = message_joined.split(' ');
            rank = data[1];
            if(!valid_minehut_ranks.includes(rank)) {
                rank = "[DEFAULT]";
            }
            userr = data[1];
            if(valid_minehut_ranks.includes(rank)) {
                userr = data[2];
            }
            user = userr.replace(':', '')
            server = data[3];
            if(server === "/join") {
                server = data[4];
            }
            console.log(`[Advertisement] ${user} has advertised ${server} with ${rank}!`);
            if(server.toLowerCase() === "elestra" || server.toLowerCase() === "genversa" || server.toLowerCase() === "mineversa") {
                let channel = dc_bot.channels.cache.get('832720733552902154');
                let message_embed = new discord.MessageEmbed()
                    .setColor(`#FFBB33`)
                    .setDescription(`${user} has advertised!\n\nWhat Server? ${server.toLowerCase()}\nWhat Rank? ${rank}`)
                    .setThumbnail(`https://minotar.net/helm/${user}`)
                    .setAuthor(`Server Advertisement`)
                    .setFooter(`Coded by Madelyn | Versa Realms`)
                channel.send(message_embed);
                let model_1 = new advert_model({
                    advertiser: user,
                    server: server.toLowerCase(),
                    rank: rank,
                });
                try {
                    model_1.save();
                } catch(error) {
                    console.log(error);
                }
                let model_2 = await server_model.findOne({ server: server.toLowerCase() });
                if(!model_2) {
                    let new_model_2 = new server_model({
                        server: server.toLowerCase(),
                        ad_party: 0
                    });
                    try {
                        new_model_2.save();
                    } catch(error) {
                        console.log(error);
                    }
                } else if(model_2) {
                    let new_num = model_2.ad_party;
                    new_num = new_num + 1;
                    server_model.updateOne({ server: server.toLowerCase() }, { ad_party: new_num }, (error) => {
                        if(error) {
                            console.log(error);
                        }
                    });
                }
            }
        }
    }
});