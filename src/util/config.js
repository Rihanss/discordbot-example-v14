require('dotenv').config();

module.exports = {
	clientConfig: {
		token: process.env.TOKEN,
		clientId: process.env.CLIENTID,
	}
};
