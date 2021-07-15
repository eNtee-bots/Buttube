
const { MessageButton, MessageActionRow } = require('discord-buttons'); 
const {MessageEmbed} = require("discord.js")
const Guild = require('../../../schemas/Guild');
class buttube {
    /**
     * 
     * @param {Discord.Client} client - A discord.js client.
     */

    constructor(client, url = '') {

        if (!client) throw new Error("A client wasn't provided.");

        this.client = client;
        const DisTube = require('distube')
        const SpotifyPlugin = require("@distube/spotify")
        const SountCloudPlugin = require("@distube/soundcloud")
        this.distube = new DisTube(client, {
        searchSongs: 0,
        leaveOnEmpty: false,
        savePreviousSongs: true,
        emitNewSongOnly: true,
        plugins: [new SpotifyPlugin({ parallel: true }), new SountCloudPlugin()], 
    }) 
    }
    async setup(message){
        const stop = new MessageButton()
      .setLabel('Stop')
      .setEmoji("⏹")
      .setStyle('grey')
      .setID('stop');
      const pause = new MessageButton()
      .setLabel('Pause')
      .setEmoji("⏸")
      .setStyle('grey')
      .setID('pause');
      const resume = new MessageButton()
      .setLabel('Resume')
      .setEmoji("▶️")
      .setStyle('grey')
      .setID('resume');
      const skip = new MessageButton()
      .setLabel('Skip')
      .setEmoji("⏩")
      .setStyle('grey')
      .setID('skip');
      const vup = new MessageButton()
      .setLabel('Volume 10%')
      .setEmoji("➕")
      .setStyle('grey')
      .setID('vup');
      const vdown = new MessageButton()
      .setLabel('Volume 10%')
      .setEmoji("➖")
      .setStyle('grey')
      .setID('vdown');
      const que = new MessageButton()
      .setLabel('Get the Queue')
      .setEmoji("💿")
      .setStyle('grey')
      .setID('que');
      const shuffle = new MessageButton()
      .setLabel('Shuffle')
      .setEmoji("🔀")
      .setStyle('grey')
      .setID('shuffle');
      const autoplay = new MessageButton()
      .setLabel('Autoplay ON/OFF')
      .setEmoji("🎵")
      .setStyle('grey')
      .setID('autoplay');
      const previous = new MessageButton()
      .setLabel('Previous song')
      .setEmoji("⏪")
      .setStyle('grey')
      .setID('previous');
      const row = new MessageActionRow()
      .addComponent(stop)
      .addComponent(pause)
      .addComponent(resume)
      .addComponent(skip)
      .addComponent(vup);
      const row2 = new MessageActionRow()
      .addComponent(vdown)
      .addComponent(shuffle)
      .addComponent(autoplay)
      .addComponent(previous)
      .addComponent(que);
 const musicem = new MessageEmbed()
    .setTitle('Not Playing')
    .setDescription("Join a voice channel and enter a song name or a link to play.")
    .setThumbnail(`https://media1.tenor.com/images/14fdefd2dec424b44882d55372643ca6/tenor.gif?itemid=8009185`)
        const msg = await  message.channel.send({embed: musicem, components: [row, row2]})

        const settings = await Guild.findOne({
          guildId: message.guild.id,
        }, async (err, guild) => {
          if (err) console.log(err)
          
          if (!guild) {
            const newGuild = await Guild.create({
              guildId: message.guild.id
            });
          }
        });

        await settings.updateOne({
          musictoggle: true,
          musicmsg: msg.id,
          musicch: message.channel.id,
         });
      
    }
    async play(message, music){
      try{
        this.events(message)
        this.distube.play(message, music)
      }catch(err){
        console.log(err)
        message.reply("Unsupported URL!").then(m => m.delete({ timeout: 5000 }));
      }
    }
    async events(message){
      const settings = await Guild.findOne({
        guildId: message.guild.id,
      }, async (err, guild) => {
        if (err) console.log(err)
        
        if (!guild) {
          const newGuild = await Guild.create({
            guildId: message.guild.id
          });
        }
      });
            const msgId = settings.musicmsg
            const msgch = settings.musicch
            let msg = await client.channels.cache
            .get(msgch).messages
            .fetch(msgId) // message id 
        this.distube
     .on("playSong", (message, queue, song) =>{
     const embed1 = new MessageEmbed()
        .setTitle(`Now Playing [${song.name}]`)
        .setDescription("Join a voice channel and enter a song name or a link to play.")
        .setThumbnail(song.thumbnail || "https://media1.tenor.com/images/14fdefd2dec424b44882d55372643ca6/tenor.gif?itemid=8009185")  
      msg.edit(embed1)
        })
      .on("addSong", (message, queue, song) => message.channel.send(
            `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
        ).then(m => m.delete({ timeout: 5000 })
        ))
        .on("finish", (message, que, song) =>{
    const embed = new MessageEmbed()
        .setTitle('Not Playing')
        .setDescription("Join a voice channel and enter a song name or a link to play.")
        .setThumbnail(`https://media1.tenor.com/images/14fdefd2dec424b44882d55372643ca6/tenor.gif?itemid=8009185`)
        msg.edit(embed)
        });
    }
async button(button){
    const embed = new MessageEmbed()
    .setTitle('Not Playing')
    .setDescription("Join a voice channel and enter a song name or a link to play.")
    .setThumbnail(`https://media1.tenor.com/images/14fdefd2dec424b44882d55372643ca6/tenor.gif?itemid=8009185`)
  const message = button.message;
  if(button.id == 'stop'){
    let queue = this.distube.getQueue(message);
    if(!queue){
      const embed = new MessageEmbed()
    .setTitle('nothing in the queue')
    .setColor(message.guild.me.displayHexColor)
      button.reply.send({ embed: embed, ephemeral: true });
      return;
    }
  this.distube.stop(message)
    button.message.edit({ embed: embed, ephemeral: false })
    button.reply.send('Stopped', true)
  }else if(button.id == 'pause'){
    let queue = this.distube.getQueue(message);
    if(!queue){
      const embed = new MessageEmbed()
    .setTitle('nothing in the queue')
    .setColor(message.guild.me.displayHexColor)
      button.reply.send({ embed: embed, ephemeral: true });
      return;
    }
  this.distube.pause(message)
    button.reply.send('Paused', true)
  }else if(button.id == 'resume'){
    let queue = this.distube.getQueue(message);
    if(!queue){
      const embed = new MessageEmbed()
    .setTitle('nothing in the queue')
    .setColor(message.guild.me.displayHexColor)
      button.reply.send({ embed: embed, ephemeral: true });
      return;
    }
  this.distube.resume(message)
    button.reply.send('Resumed', true)
  }else if(button.id == 'que'){
    let queue = this.distube.getQueue(message);
    if(!queue){
      const embed = new MessageEmbed()
    .setTitle('nothing in the queue')
    .setColor(message.guild.me.displayHexColor)
      button.reply.send({ embed: embed, ephemeral: true });
    }else{
      const embed = new MessageEmbed()
      .setDescription(`**🎧 ⁓ Current queue**:\n\n` + queue.songs.map((song, id) => `> **${id + 1}**. ${song.name} - \`${song.formattedDuration}\``).slice(0, 20).join("\n") + "\nand more...")
      .setColor(message.guild.me.displayHexColor)
      button.reply.send({ embed: embed, ephemeral: true });
    }
  }else if(button.id == 'skip'){
    let queue = this.distube.getQueue(message);
    if(!queue){
      const embed = new MessageEmbed()
    .setTitle('nothing in the queue')
    .setColor(message.guild.me.displayHexColor)
      button.reply.send({ embed: embed, ephemeral: true });
      return;
    }
  this.distube.skip(message)
    button.reply.send('Skipped', true)
}else if(button.id == 'vup'){
  let queue = this.distube.getQueue(message);
  if(!queue){
    const embed = new MessageEmbed()
  .setTitle('nothing in the queue')
  .setColor(message.guild.me.displayHexColor)
    button.reply.send({ embed: embed, ephemeral: true });
    return;
  }

  const settings = await Guild.findOne({
    guildId: button.guild.id,
  });

  let volume = settings.volume;
  if(settings.volume > 200){
    await settings.updateOne({
      volume: 50,
     });
     button.reply.send('Volume over 200%! I changed it for you to 50%', true)
     volume = 50
   this.distube.setVolume(message, volume)
  }else{
    settings.volume += parseInt(10, 10)
    settings.save()
  this.distube.setVolume(message, volume)
    button.reply.send('Volume 10% UP', true)

  }


}else if(button.id == 'vdown'){
  let queue = this.distube.getQueue(message);
  if(!queue){
    const embed = new MessageEmbed()
  .setTitle('nothing in the queue')
  .setColor(message.guild.me.displayHexColor)
    button.reply.send({ embed: embed, ephemeral: true });
    return;
  }

  const settings = await Guild.findOne({
    guildId: button.guild.id,
  });

  let volume = settings.volume;
  if(settings.volume < 10){
    await settings.updateOne({
      volume: 50,
     });
     button.reply.send('Volume < 10%! I changed it for you to 50%', true)
     volume = 50
   this.distube.setVolume(message, volume)
  }else{
    settings.volume += parseInt(10, 10)
    settings.save()
  this.distube.setVolume(message, volume)
    button.reply.send('Volume 10% DOWN', true)

  }
}else if(button.id == 'shuffle'){
  let queue = this.distube.getQueue(message);
  if(!queue){
    const embed = new MessageEmbed()
  .setTitle('nothing in the queue')
  .setColor(message.guild.me.displayHexColor)
    button.reply.send({ embed: embed, ephemeral: true });
    return;
  }
  button.reply.send('Shuffle the Queue', true)
this.distube.shuffle(message)


}else if(button.id == 'autoplay'){
  let queue = this.distube.getQueue(message);
  if(!queue){
    const embed = new MessageEmbed()
  .setTitle('nothing in the queue')
  .setColor(message.guild.me.displayHexColor)
    button.reply.send({ embed: embed, ephemeral: true });
    return;
  }

  let mode = this.distube.toggleAutoplay(message);
  button.reply.send("Set autoplay mode to `" + (mode ? "On" : "Off") + "`", true)

}else if(button.id == 'previous'){
  let queue = this.distube.getQueue(message);
  if(!queue){
    const embed = new MessageEmbed()
  .setTitle('nothing in the queue')
  .setColor(message.guild.me.displayHexColor)
    button.reply.send({ embed: embed, ephemeral: true });
    return;
  }

  this.distube.previous(message);
  button.reply.send("Playing previous Song!", true)

}
}
}
module.exports =  buttube;
