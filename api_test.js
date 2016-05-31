var assert = require('chai').assert;
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var supertest = require('supertest');

var request;
var server;
var carId1 = '1235';
var carId2 = '1234';

before(function() {
  request = {};
  request.post = sinon.stub();
  server = proxyquire('./server.js', {
    'request': request
  });
});

describe('Unit tests for ID 1235', function() {
  
  it('Vehicle Info for carId 1235', function() {
    var gmapiurl = 'http://gmapi.azurewebsites.net/getVehicleInfoService/' + carId1;
    var gmapiresp = {
      'service': 'getVehicleInfo',
      'status': '200',
      'data': {
        'vin': {
          'type': 'String',
          'value': '1235AZ91XP'
        },
        'color': {
          'type': 'String',
          'value': 'Forest Green'
        },
        'fourDoorSedan': {
          'type': 'Boolean',
          'value': 'False'
        },
        'twoDoorCoupe': {
          'type': 'Boolean',
          'value': 'True'
        },
        'driveTrain': {
          'type': 'String',
          'value': 'electric'
        }
      }
    };

    var smartcarapi = {
      vin: '1235AZ91XP',
      color: 'Forest Green',
      doorCount: 2,
      driveTrain: 'electric'
    };

    supertest(server).get('/vehicles/' + carId1)
      .end(function(err, res) {
        assert.equal(JSON.stringify(res.body), JSON.stringify(smartcarapi), "Got vehicle metadata");
      });
  });

  it('Security for carId 1235', function() {
    var gmapiurl = 'http://gmapi.azurewebsites.net/getSecurityStatusService/' + carId1;
    var gmapiresp = {
      'service': 'getSecurityStatus',
      'status': '200',
      'data': {
        'doors': {
          'type': 'Array',
          'values': [{
            'location': {
              'type': 'String',
              'value': 'frontLeft'
            },
            'locked': {
              'type': 'Boolean',
              'value': 'False'
            }
          }, {
            'location': {
              'type': 'String',
              'value': 'frontRight'
            },
            'locked': {
              'type': 'Boolean',
              'value': 'True'
            }
          }]
        }
      }
    };

    var smartcarapi = [{
      location: 'frontLeft',
      locked: false
    }, {
      location: 'frontRight',
      locked: true
    }];

    supertest(server).get('/vehicles/' + carId1 + '/doors')
      .end(function(err, res) {
        assert.equal(JSON.stringify(res.body), JSON.stringify(smartcarapi), "Got vehicle door details");
      });
  });

  it('Battery Level for carId 1235', function() {
    var gmapiurl = 'http://gmapi.azurewebsites.net/getEnergyService/' + carId1;
    var gmapiresp = {
      'service': 'getEnergyService',
      'status': '200',
      'data': {
        'tankLevel': {
          'type': 'Number',
          'value': '30'
        },
        'batteryLevel': {
          'type': 'Null',
          'value': 'null'
        }
      }
    };

    var smartcarapi = {
      percent: 0
    };

    supertest(server).get('/vehicles/' + carId1 + '/battery')
      .end(function(err, res) {
        assert.equal(JSON.stringify(res.body), JSON.stringify(smartcarapi), "Got vehicle battery Level");
      });
  });

  it('Fuel Level for carId 1235', function() {
    var gmapiurl = 'http://gmapi.azurewebsites.net/getEnergyService/' + carId1;
    var gmapiresp = {
      'service': 'getEnergyService',
      'status': '200',
      'data': {
        'tankLevel': {
          'type': 'Number',
          'value': '30'
        },
        'batteryLevel': {
          'type': 'Null',
          'value': 'null'
        }
      }
    };

    var smartcarapi = {
      percent: 30
    };

    supertest(server).get('/vehicles/' + carId1 + '/fuel')
      .end(function(err, res) {
        assert.equal(JSON.stringify(res.body), JSON.stringify(smartcarapi), "Got vehicle fuel Level");
      });
  });

  it('Start/Stop Engine for carId 1235', function() {
    var gmapiurl = 'http://gmapi.azurewebsites.net/actionEngineService/' + carId1;
    var gmapiresp = {
      'service': 'actionEngine',
      'status': '200',
      'actionResult': {
        'status': 'EXECUTED'
      }
    };

    var smartcarapi = {
      status: 'success'
    };

    supertest(server).post('/vehicles/' + carId1 + '/engine')
      .set('Content-Type', 'application/json')
      .send({'action': 'START'})
      .end(function(err, res) {
        assert.equal(JSON.stringify(res.body), JSON.stringify(smartcarapi), "Engine status");
      });
  });
});

describe('Unit tests for ID 1234', function() {

  it('Vehicle Info for carId 1234', function() {
    var gmapiurl = 'http://gmapi.azurewebsites.net/getVehicleInfoService/' + carId2;
    var gmapiresp = {
      'service': 'getVehicleInfo',
      'status': '200',
      'data': {
        'vin': {
          'type': 'String',
          'value': '123123412412'
        },
        'color': {
          'type': 'String',
          'value': 'Metallic Silver'
        },
        'fourDoorSedan': {
          'type': 'Boolean',
          'value': 'True'
        },
        'twoDoorCoupe': {
          'type': 'Boolean',
          'value': 'False'
        },
        'driveTrain': {
          'type': 'String',
          'value': 'v8'
        }
      }
    };

    var smartcarapi = {
      vin: '123123412412',
      color: 'Metallic Silver',
      doorCount: 4,
      driveTrain: 'v8'
    };

    supertest(server).get('/vehicles/' + carId2)
      .end(function(err, res) {
        assert.equal(JSON.stringify(res.body), JSON.stringify(smartcarapi), "Got vehicle metadata");
      });
  });

  it('Security for carId 1234', function() {
    var gmapiurl = 'http://gmapi.azurewebsites.net/getSecurityStatusService/' + carId2;
    var gmapiresp = {
      'service': 'getSecurityStatus',
      'status': '200',
      'data': {
        'doors': {
          'type': 'Array',
          'values': [{
            'location': {
              'type': 'String',
              'value': 'frontRight'
            },
            'locked': {
              'type': 'Boolean',
              'value': 'False'
            } },
            {
            'location': {
              'type': 'String',
              'value': 'backRight'
            },
            'locked': {
              'type': 'Boolean',
              'value': 'True'
            } }, {
            'location': {
              'type': 'String',
              'value': 'frontLeft'
            },
            'locked': {
              'type': 'Boolean',
              'value': 'False'
            } }, {
            'location': {
              'type': 'String',
              'value': 'backLeft'
            },
            'locked': {
              'type': 'Boolean',
              'value': 'True'
            }
          }]
        }
      }
    };

    var smartcarapi = [{
      location: 'frontRight',
      locked: false
    }, {
      location: 'backRight',
      locked: true
    }, {
      location: 'frontLeft',
      locked: false
    }, {
      location: 'backLeft',
      locked: true
    }];

    supertest(server).get('/vehicles/' + carId2 + '/doors')
      .end(function(err, res) {
        assert.equal(JSON.stringify(res.body), JSON.stringify(smartcarapi), "Got vehicle door details");
      });
  });

  it('Battery Level for carId 1234', function() {
    var gmapiurl = 'http://gmapi.azurewebsites.net/getEnergyService/' + carId2;
    var gmapiresp = {
      'service': 'getEnergyService',
      'status': '200',
      'data': {
        'tankLevel': {
          'type': 'Number',
          'value': 'null'
        },
        'batteryLevel': {
          'type': 'Null',
          'value': '50'
        }
      }
    };

    var smartcarapi = {
      percent: 50
    };

    supertest(server).get('/vehicles/' + carId2 + '/battery')
      .end(function(err, res) {
        assert.equal(JSON.stringify(res.body), JSON.stringify(smartcarapi), "Got vehicle battery Level");
      });
  });

  it('Fuel Level for carId 1234', function() {
    var gmapiurl = 'http://gmapi.azurewebsites.net/getEnergyService/' + carId2;
    var gmapiresp = {
      'service': 'getEnergyService',
      'status': '200',
      'data': {
        'tankLevel': {
          'type': 'Number',
          'value': 'null'
        },
        'batteryLevel': {
          'type': 'Null',
          'value': '50'
        }
      }
    };

    var smartcarapi = {
      percent: 0
    };

    supertest(server).get('/vehicles/' + carId2 + '/fuel')
      .end(function(err, res) {
        assert.equal(JSON.stringify(res.body), JSON.stringify(smartcarapi), "Got vehicle fuel Level");
      });
  });

  it('Start/Stop Engine for carId 1234', function() {
    var gmapiurl = 'http://gmapi.azurewebsites.net/actionEngineService/' + carId2;
    var gmapiresp = {
      'service': 'actionEngine',
      'status': '200',
      'actionResult': {
        'status': 'NOT EXECUTED'
      }
    };

    var smartcarapi = {
      status: 'error'
    };

    supertest(server).post('/vehicles/' + carId2 + '/engine')
      .set('Content-Type', 'application/json')
      .send({'action': 'START'})
      .end(function(err, res) {
        assert.equal(JSON.stringify(res.body), JSON.stringify(smartcarapi), "Engine status");
      });
  });
});


