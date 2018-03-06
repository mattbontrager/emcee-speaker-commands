'use strict';

process.env.NODE_ENV = 'test';

const should = require('should');

const request = require('supertest');
const config = require('../../config');
const service = require('../../server/service')(config);

describe('The express service', () => {
	describe('GET /foo', () => {
		it('should return HTTP 404', (done) => {
			request(service)
				.get('/foo')
				.expect(404, done);
		});
	});

	// speaker command
	describe('GET about command /service/:thecommand', () => {
		// about me command
		it('should return HTTP 200 and a reply with a valid result', (done) => {
			request(service)
				.get('/service/aboutme')
				.set('X-EMCEE-SERVICE-TOKEN', config.serviceAccessToken)
				.expect(200)
				.end((err, res) => {
					if (err) {
						return done(err);
					}
					should.exist(res.body.result);
					should.not.exist(res.body.warning);
					return done();
				});
		});

		it('should return HTTP 403 if no valid token was passed', (done) => {
			request(service)
				.get('/service/aboutme')
				.set('X-EMCEE-SERVICE-TOKEN', 'wrongToken')
				.expect(403)
				.end(done);
		});
	});

	describe('POST sessionstart /service', () => {
		it('should return HTTP 201', (done) => {
			request(service)
				.post('/service')
				.set('X-EMCEE-SERVICE-TOKEN', config.serviceAccessToken)
				.send({'command': 'sessionstart'})
				.expect(201)
				.end((err, res) => {
					if (err) {
						return done(err);
					}

					should.not.exist(res.body.warning);
					return done();
				});
		});

		it('should return HTTP 403 if no valid token was passed', (done) => {
			request(service)
				.post('/service')
				.set('X-EMCEE-SERVICE-TOKEN', 'wrongToken')
				.send({'command': 'sessionstart'})
				.expect(403)
				.end(done);
		});
	});

	describe('POST sessionend /service', () => {
		it('should return HTTP 201', (done) => {
			request(service)
				.post('/service')
				.set('X-EMCEE-SERVICE-TOKEN', config.serviceAccessToken)
				.send({'command': 'sessionend'})
				.expect(201)
				.end((err, res) => {
					if (err) {
						return done(err);
					}

					should.not.exist(res.body.warning);
					return done();
				});
		});

		it('should return HTTP 403 if no valid token was passed', (done) => {
			request(service)
				.post('/service')
				.set('X-EMCEE-SERVICE-TOKEN', 'wrongToken')
				.send({'command': 'sessionend'})
				.expect(403)
				.end(done);
		});
	});

	describe('POST talkstart /service', () => {
		it('should return HTTP 201', (done) => {
			request(service)
				.post('/service')
				.set('X-EMCEE-SERVICE-TOKEN', config.serviceAccessToken)
				.send({'command': 'talkstart'})
				.expect(201)
				.end((err, res) => {
					if (err) {
						return done(err);
					}

					should.not.exist(res.body.warning);
					return done();
				});
		});

		it('should return HTTP 403 if no valid token was passed', (done) => {
			request(service)
				.post('/service')
				.set('X-EMCEE-SERVICE-TOKEN', 'wrongToken')
				.send({'command': 'talkstart'})
				.expect(403)
				.end(done);
		});
	});

	describe('POST talkend /service', () => {
		it('should return HTTP 201', (done) => {
			request(service)
				.post('/service')
				.set('X-EMCEE-SERVICE-TOKEN', config.serviceAccessToken)
				.send({'command': 'talkend'})
				.expect(201)
				.end((err, res) => {
					if (err) {
						return done(err);
					}

					should.not.exist(res.body.warning);
					return done();
				});
		});

		it('should return HTTP 403 if no valid token was passed', (done) => {
			request(service)
				.post('/service')
				.set('X-EMCEE-SERVICE-TOKEN', 'wrongToken')
				.send({'command': 'talkend'})
				.expect(403)
				.end(done);
		});
	});

	describe('POST Q&A Start /service', () => {
		it('should return HTTP 201', (done) => {
			request(service)
				.post('/service')
				.set('X-EMCEE-SERVICE-TOKEN', config.serviceAccessToken)
				.send({'command': 'qastart'})
				.expect(201)
				.end((err, res) => {
					if (err) {
						return done(err);
					}

					should.not.exist(res.body.warning);
					return done();
				});
		});

		it('should return HTTP 403 if no valid token was passed', (done) => {
			request(service)
				.post('/service')
				.set('X-EMCEE-SERVICE-TOKEN', 'wrongToken')
				.send({'command': 'qastart'})
				.expect(403)
				.end(done);
		});
	});

	describe('POST Q&A Stop /service', () => {
		it('should return HTTP 201', (done) => {
			request(service)
				.post('/service')
				.set('X-EMCEE-SERVICE-TOKEN', config.serviceAccessToken)
				.send({'command': 'qaend'})
				.expect(201)
				.end((err, res) => {
					if (err) {
						return done(err);
					}

					should.not.exist(res.body.warning);
					return done();
				});
		});

		it('should return HTTP 403 if no valid token was passed', (done) => {
			request(service)
				.post('/service')
				.set('X-EMCEE-SERVICE-TOKEN', 'wrongToken')
				.send({'command': 'qaend'})
				.expect(403)
				.end(done);
		});
	});
});