'use strict';

module.exports = (config) => {
	const express = require('express');
	const service = express();
	const bodyParser = require('body-parser');
	const moment = require('moment');
	const aboutMeLink = '[Matt Bontrager\'s Bio](https://about.me/mattbontrager "Matt Bontrager: About Me")';
	const log = config.log();

	service.use(bodyParser.json());
	service.use(bodyParser.urlencoded({extended: true}));

	const knex = require('knex')({
		client: 'mysql',
		connection: {
			host : config.db.url,
			user : config.db.user,
			password : config.db.password,
			database : config.db.db
		}
	});

	const updateTalk = (column) => {
		if (process.env.NODE_ENV === 'test') {
			return knex('talks')
				.where('id', 1)
				.update({
					[column]: `${moment().format('YYYY-MM-DD HH:mm:ss')}`
				})
				.then(() => {
					return true;
				})
				.catch(err => {
					log.error('something went wrong updating the talks: ', err);
					return err;
				});
		}

		return knex('talks')
			.where('date', '=', moment().format('YYYY-MM-DD'))
			.andWhere('time', '<', moment().format('HH:mm:ss'))
			.update({
				[column]: `${moment().format('YYYY-MM-DD HH:mm:ss')}`
			})
			.then(() => {
				return true;
			})
			.catch(err => {
				log.error('something went wrong updating the talks: ', err);
				return err;
			});
	};

	const handleGetCommand = (command) => {
		return new Promise((resolve, reject) => {
			if (command === 'aboutme') {
				resolve(aboutMeLink);
			} else {
				reject(`:hankey: you sent a command I didn't recognize: ${command}.`);
			}
		});
	};

	/* eslint-disable */
	const handlePostCommand = (command) => {
		var column = null;
		switch(command) {
			case 'sessionstart':
				column = 'session_start';
				break;
			case 'sessionend':
				column = 'session_end';
				break;
			case 'talkstart':
				column = 'talk_start';
				break;
			case 'talkend':
				column = 'talk_end';
				break;
			case 'qastart':
				column = 'Q_A_start';
				break;
			case 'qaend':
				column = 'Q_A_end';
				break;
		}
		if (!column) {
			return `:hankey: you sent a command I didn\'t recognize: ${command}.`;
		}
		return updateTalk(column).then(response => {
			return response;
		}, rejection => {
			return rejection;
		}).catch(err => {
			throw new Error(err);
		});
	};
	/* eslint-enable */

	service.get('/service/:command', (req, res) => {
		if (req.get('X-EMCEE-SERVICE-TOKEN') !== config.serviceAccessToken) {
			return res.sendStatus(403);
		}

		if (process.env.NODE_ENV === 'TEST' && req.command !== 'about') {
			return res.json({result: 'congratulations'});
		}

		handleGetCommand(req.params.command).then(response => {
			res.status(200);
			res.json({result: response});
		}, rejection => {
			log.warn(`the rejection: ${rejection}`);
			res.json({warning: rejection});
		}).catch(err => {
			log.error(`handleGetCommand error: ${JSON.stringify(err)}`);
			res.sendStatus(500);
		});
	});

	service.post('/service', (req, res) => {
		if (req.get('X-EMCEE-SERVICE-TOKEN') !== config.serviceAccessToken) {
			return res.sendStatus(403);
		}
		if (process.env.NODE_ENV === 'TEST' && req.command !== 'about') {
			return res.json({result: 'congratulations'});
		}
		handlePostCommand(req.body.command).then(() => {
			res.sendStatus(201);
		}, rejection => {
			log.warn(`the rejection: ${rejection}`);
			res.json({warning: rejection});
		}).catch(err => {
			log.error(`handlePostCommand error: ${JSON.stringify(err)}`);
			res.sendStatus(500);
		});
	});

	service.put('/service', (req, res) => {
		return res.sendStatus(501);
	});
	service.delete('/service', (req, res) => {
		return res.sendStatus(501);
	});
	return service;
};