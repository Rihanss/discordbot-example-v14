const Command = require('../../structures/CommandClass');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const rows = 6;
const cols = 7;
const empty = ':black_circle:';
const player1 = ':red_circle:';
const player2 = ':yellow_circle:';
let gameBoard = [];
let currentPlayer = player1;
let gameOver = false;

const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣'];
const forfeitEmoji = '❌';

module.exports = class ConnectFour extends Command {
	constructor(client) {
		super(client, {
			data: new SlashCommandBuilder()
				.setName('connect4')
				.setDescription('[Holo | Fun] Play connect4 with someone!')
				.setDMPermission(true)
				.addUserOption(option => option
					.setName('user')
					.setDescription('The user to play connect4 with')
					.setRequired(true),
				),
			usage: 'connect4 <@user>',
			category: 'Fun',
			permissions: ['Use Application Commands', 'Send Messages', 'Embed Links'],
			hidden: false,
		});
	}

	async run(client, interaction) {
		await interaction.deferReply();

		const opponent = interaction.options.getUser('user');
		if (opponent.id === interaction.user.id) {
			return interaction.editReply('You cannot play against yourself!');
		}
		else if (opponent.bot) {
			return interaction.editReply('You cannot play against a bot!');
		}

		initializeBoard();
		const boardMessage = await displayBoard(interaction);
		await announceTurn(interaction);

		for (const emoji of emojis) {
			await boardMessage.react(emoji);
		}
		await boardMessage.react(forfeitEmoji);

		const filter = (reaction, user) => {
			return (emojis.includes(reaction.emoji.name) || reaction.emoji.name === forfeitEmoji) &&
                (user.id === interaction.user.id || user.id === opponent.id);
		};

		const collector = boardMessage.createReactionCollector({ filter, time: 60000 });

		collector.on('collect', async (reaction, user) => {
			if (gameOver) return;

			if (reaction.emoji.name === forfeitEmoji) {
				gameOver = true;
				const forfeiterId = user.id;
				const winnerId = forfeiterId === interaction.user.id ? opponent.id : interaction.user.id;

				await interaction.editReply({ content: `<@${forfeiterId}> forfeited. Congratulations <@${winnerId}> for winning!` });
				await boardMessage.reactions.removeAll();
				return;
			}

			const col = emojis.indexOf(reaction.emoji.name);
			if (user.id === getPlayerId(currentPlayer, interaction)) {
				await handleMove(interaction, currentPlayer, col);
				await reaction.users.remove(user.id);
				if (!gameOver) {
					currentPlayer = (currentPlayer === player1) ? player2 : player1;
					await announceTurn(interaction);
				}
				else {
					collector.stop();
					boardMessage.reactions.removeAll();
				}
			}
			else {
				await reaction.users.remove(user.id);
			}
		});

		collector.on('end', collected => {
			if (collected.size === 0 && !gameOver) {
				interaction.editReply('Timeout! Please try again');
				boardMessage.reactions.removeAll();
			}
		});
	}
};

function getPlayerId(player, interaction) {
	return player === player1 ? interaction.user.id : interaction.options.getUser('user').id;
}

function initializeBoard() {
	gameBoard = [];
	for (let i = 0; i < rows; i++) {
		gameBoard.push(Array(cols).fill(empty));
	}
	currentPlayer = player1;
	gameOver = false;
}

async function displayBoard(interaction) {
	let boardString = '';
	for (let row = rows - 1; row >= 0; row--) {
		boardString += gameBoard[row].join(' ') + '\n';
	}
	boardString += emojis.join(' ');
	const embed = new EmbedBuilder()
		.setColor('#0099ff')
		.setTitle('Connect 4 Game')
		.setDescription(boardString)
		.setFooter({ text: 'Use numbered reaction below to progress.' });
	const message = await interaction.editReply({ embeds: [embed], fetchReply: true });
	return message;
}

async function announceTurn(interaction) {
	if (!gameOver) {
		const playerId = getPlayerId(currentPlayer, interaction);
		await interaction.editReply({ content: `It's <@${playerId}> player's turn!` });
	}
}

function checkWin(row, col, player) {
	const directions = [
		[0, 1], [1, 0], [1, 1], [1, -1],
	];
	for (const dir of directions) {
		let count = 1;
		for (const mult of [-1, 1]) {
			for (let i = 1; i < 4; i++) {
				const newRow = row + dir[0] * i * mult;
				const newCol = col + dir[1] * i * mult;
				if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && gameBoard[newRow][newCol] === player) {
					count++;
				}
				else {
					break;
				}
			}
		}
		if (count >= 4) {
			return true;
		}
	}
	return false;
}

async function handleMove(interaction, player, col) {
	let placed = false;
	for (let row = 0; row < rows; row++) {
		if (gameBoard[row][col] === empty) {
			gameBoard[row][col] = player;
			placed = true;
			await displayBoard(interaction);
			if (checkWin(row, col, player)) {
				gameOver = true;
				const winnerId = getPlayerId(player, interaction);
				await interaction.editReply({ content: `${player === player1 ? 'Red' : 'Yellow'} player wins! Congratulations <@${winnerId}>!` });
				return;
			}
			break;
		}
	}
	if (!placed) {
		await interaction.editReply('Column is full, please pick another column.');
	}
	if (isBoardFull() && !gameOver) {
		gameOver = true;
		await interaction.editReply('It\'s a draw! No more moves available.');
	}
}

function isBoardFull() {
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			if (gameBoard[row][col] === empty) {
				return false;
			}
		}
	}
	return true;
}
