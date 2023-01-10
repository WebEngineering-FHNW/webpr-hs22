
import {arab}    from "./util.js";

'./util.js';
import { Suite } from './test.js';

const util = Suite("util");

// extending the prototype of many objects
util.test("times-num", assert => {

    const collect = [];

    (10).times( n => collect.push(n) );

    assert.is(collect.length, 10);
    assert.is(collect[0], 0);
    assert.is(collect[9], 9);

});

util.test("times-str", assert => {

    const collect = [];

    '10'.times( n => collect.push(n) );

    assert.is(collect.length, 10);
    assert.is(collect[0], 0);
    assert.is(collect[9], 9);

});

util.test("roman", assert => {
    assert.is(arab("") ,          0);
    assert.is(arab("I"),          1);
    assert.is(arab("II"),         2);
    assert.is(arab("V" ),         5);
    assert.is(arab("VI"),         6);
    assert.is(arab("X" ),         10);
    assert.is(arab("IV"),         4);
    assert.is(arab("IX"),         9);
    assert.is(arab("XL"),         40);
    assert.is(arab("XC"),         90);
    assert.is(arab("CD"),         400);
    assert.is(arab("CM"),         900);
    assert.is(arab("L" ),         50);
    assert.is(arab("MDCXXXII"), 1632);
});
