'use strict';
const config = require('../config');
const log = config.log();
const request = require('superagent');
const service = require('../server/service')(config);
const http = require('http');

const server = http.createServer(service);
server.listen();

server.on('listening', function() {
	log.info(`EMCEE-COMMANDS is listening on ${server.address().port} in ${service.get('env')} mode.`);

	const announce = () => {
		request.put(`http://127.0.0.1:4001/service/commands/${server.address().port}`)
			.set('X-EMCEE-SERVICE-TOKEN', config.serviceAccessToken)
			.set('X-EMCEE-API-TOKEN', config.emceeApiToken)
			.end((err) => {
				if (err) {
					log.debug(err);
					log.info('Error connecting to Emcee');
				}
			});
	};
	announce();
	setInterval(announce, 15 * 1000);
});