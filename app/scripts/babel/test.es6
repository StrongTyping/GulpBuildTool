export default class Person {

    constructor(name) {
        this.name = name;
    }

    sayHello() {
        console.log('sayHello');
        return `Hello ${this.name}!`;
    }

    sayHelloThreeTimes() {
        let hello = this.sayHello();
        return `${hello} `.repeat(3);
        console.log('browserify');
    }
    greet(name) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('hello ' + name);
            }, 1000);
        });
    }

}
