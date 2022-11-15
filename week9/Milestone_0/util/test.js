"use strict";

// todo: jsdoc

const Assert = () => {
    const ok = [];

    const equals = (actual, expected) => {
        const result = (actual === expected);
        if (! result) {
           console.error(`not equal! actual was '${actual}' but expected '${expected}'`);
        }
        ok.push(result);
    };
    return {
        getOk: () => ok,
        equals: equals,
    }
};

const bar = extend => document.writeln("+" + "-".repeat(extend) + "+");

const fill = (str, extend) => {
    const len = str.toString().length; // in case str is not a string
    if (len > extend) {
        return str;
    }
    return " ".repeat(extend - len);
};

const padLeft = (str, extend) => "" + fill(str, extend) + str; // todo: use new stdlib function

const padRight = (str, extend) => "" + str + fill(str, extend);

const report = (origin, ok) => {
    const extend = 20;
    if ( ok.every( elem => elem) ) {
        document.writeln(" "+ padLeft(ok.length, 3) +" tests in " + padRight(origin, extend) + " ok.");
        return;
    }
    const reportLine = "    Failing tests in " + padRight(origin, extend);
    bar(reportLine.length);
    document.writeln("|" + reportLine+ "|");
    for (let i = 0; i < ok.length; i++) {
        if( ! ok[i]) {
            document.writeln("|    Test #"+ padLeft(i, 3) +" failed                     |");
        }
    }
    bar(reportLine.length);
};


const test = (origin, callback) => {
    const assert = Assert();          //    das ok anlegen
    callback(assert);                 //    das ok befüllen
    report(origin, assert.getOk());   //    report mit name und ok aufrufen
};
