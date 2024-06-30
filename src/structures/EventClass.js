module.exports = class Event {
	constructor(client, options = []) {
		this.client = client;
		this.name = options.name;
		this.raw = options.raw || false;
		this.once = options.once || false;
	}

	run() {
		throw new Error(`The Event "${this.name}" does not provided a run method. Please check it again.`);
	}
};
