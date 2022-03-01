console.log('ok...');

let s1 = Symbol('foo'),
    s2 = Symbol('bar'),
    s3 = Symbol('baz'),
    s4 = Symbol('qux');

let o = {
    [s1]: 'foo val'
}
Object.defineProperties(o, {
    [s3]: { value: 'baz val' },
    [s4]: { value: 'qux val' }
});
// console.log(o);
// {Symbol(foo): foo val, Symbol(bar): bar val,
// Symbol(baz): baz val, Symbol(qux): qux val}

class Person {
    constructor() {
        // 添加到this的所有内容都会存在与不同的实例上
        this.locate = () => console.log('instance', this);
    }
    set name(newName) {
        this.name_ = newName;
    }
    get name() {
        return this.name_;
    }
    // 定义在类的原型对象上
    locate() {
        console.log('prototype', this);
    }

    // 定义在类本身上
    static locate() {
        console.log('class', this);
    }
}

let p = new Person();
p.name = 'jake';
console.log(p.name);

