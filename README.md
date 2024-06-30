# Discord Bot Setup

This repository contains the code for a Discord bot. Follow the instructions below to set up and run the bot.

## Features

- Easy to Setup
- Made for Slash Commands
- Up to date

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have a [Discord](https://discord.com/) account.
- You have latest [Node.js](https://nodejs.org/) installed.
- You have [npm](https://www.npmjs.com/) installed.

## Setting Up the Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click on "New Application" and give it a name.

![bot create](https://imgur.com/JP2IJRj.png "Step 2")

3. You can choose between Personal or Team
4. Agree to Discord Developer Terms of Service and Developer Policy
5. You have created your Discord Bot.

### Step 2: Get the Bot Token & ID

1. In the "General Information" tab, click "Copy" under "Application ID". Save this ID as it will be used in your code.

![bot id](https://imgur.com/D9eeRHZ.png "Step 1")

2. In the "Bot" tab, click "Copy" under "TOKEN". Save this token as it will be used in your code.
> Due to a recent update from Discord, you need to reset your bot token to be able to copy it.

![bot token](https://imgur.com/Bnw52eq.png "Step 2")

> Do not share your Discord Bot Token. Tokens shown in the example are no longer valid.

### Step 3: Invite the Bot to Your Server

1. Go to the "OAuth2" tab.
2. Under "OAuth2 URL Generator", select "bot" and "application.commands".
3. Under "Bot Permissions", select the permissions your bot will need.
4. Copy the generated URL and open it in your browser.
5. Select the server you want to add the bot to and authorize it.

### Step 4: Clone the Repository

```bash
git clone https://github.com/Rihanss/discordbot-example-v14.git
```

### Step 5: Install Dependencies

```bash
npm install
```

### Step 6: Configure the Bot

1. Rename `example.env` to `.env`
2. Fill the required values from with what have you saved from step 2.

```bash
TOKEN=YOURBOTTOKEN
CLIENTID=BOTID
```

### Step 7: Start the bot

```bash
node deploy
```

> This also creates commands needed for your Discord bot to respond.

# Guides 📚

- [Creating slash commands](https://discordjs.guide/creating-your-bot/slash-commands.html)
- [Command response methods](https://discordjs.guide/slash-commands/response-methods.html)
- [Handling Commands](https://discordjs.guide/creating-your-bot/command-handling.html#command-handling)

## Support ⚙️

If you have found an issue with using this Discord bot example, feel free to submit an [issue here](https://github.com/Rihanss/discordbot-example-v14/issues) or a [pull request](https://github.com/Rihanss/discordbot-example-v14/pulls). I'll be happy to take a look

## Thanks!
This repo is maintained in my spare time. If you like the example I've provided, please give it a star :)

## License
The `MIT` license applies to this repository. Please see the `LICENSE` file to learn more.

## Check out my discord bot!
[![Discord Bots](https://top.gg/api/widget/519521318719324181.svg)](https://top.gg/bot/519521318719324181)