var assert = require('assert');
var server = require('../server.js');

describe('Cleaning Functions Tests', function() {
  describe('#taskFormat', function () {
    it('should return true if size is == 2', function () {
        var task = {
            txt:"",
            id:""
        };
      assert.equal(true, server.taskFormat(task));
    });

    it('should return false if size is > 2', function () {
        var task = {
            txt:"",
            id:"",
            waste:""
        };
      assert.equal(false, server.taskFormat(task));
    });

    it('should return true if id and txt are the only fields', function () {
        var task = {
            txt:"",
            id:""
        };
      assert.equal(true, server.taskFormat(task));
    });

    it('should return false if id is missing', function () {
        var task = {
            txt:""
        };
      assert.equal(false, server.taskFormat(task));
    });

    it('should return false if id is missing and size == 2', function () {
        var task = {
            txt:"",
            waste:""
        };
      assert.equal(false, server.taskFormat(task));
    });

    it('should return false if txt is missing', function () {
        var task = {
            id:""
        };
      assert.equal(false, server.taskFormat(task));
    });

    it('should return false if txt is missing and size == 2', function () {
        var task = {
            id:"",
            waste:""
        };
      assert.equal(false, server.taskFormat(task));
    });
  });
});
