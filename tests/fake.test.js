var expect = require('chai').expect;

var fakeFunc = require('../bot/FakeFile.js');

describe('A simple test suite', function (){
    it('should create a fakeFunc with blank config and get an error', function (){
        expect(function (){
            var myFake = new fakeFunc({});
        }).to.throw();
    });
    
    it('should create a fakeFunc with no errors if config.test is defined', function (){
        expect(function (){
            var myFake = new fakeFunc({test: 'test'});
        }).to.not.throw();
    });
});
