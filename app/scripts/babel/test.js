'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Person = function () {
    function Person(name) {
        _classCallCheck(this, Person);

        this.name = name;
    }

    _createClass(Person, [{
        key: 'sayHello',
        value: function sayHello() {
            console.log('sayHello');
            return 'Hello ' + this.name + '!';
        }
    }, {
        key: 'sayHelloThreeTimes',
        value: function sayHelloThreeTimes() {
            var hello = this.sayHello();
            return (hello + ' ').repeat(3);
            console.log('browserify');
        }
    }, {
        key: 'greet',
        value: function greet(name) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve('hello ' + name);
                }, 1000);
            });
        }
    }]);

    return Person;
}();

exports.default = Person;