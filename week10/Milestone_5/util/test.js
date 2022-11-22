"use strict";

/**
 * @typedef  AssertType
 * @property { () => Array<Boolean> } getOk - collection of all assertion results; true means "ok"
 * @property { <_T_> (actual: _T_, expected: _T_)  => void } equals - test whether actual === expected
 */

/**
 * A newly created Assert object is passed into the {@link test} callback function where it is used to
 * assert test results against expectations and keep track of the results for later reporting.
 * Follows GoF "Collecting Parameter Pattern".
 * @constructor
 * @return { AssertType }
 * @impure assembles test results.
 */
const Assert = () => {
    /** @type { Array<Boolean> } */
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

/**
 * @callback TestCallback
 * @param { AssertType } assert
 */

/**
 * Creates a new assert object, passes it into the callback for execution, and reports the result.
 * Follows Smalltalk Best Practice Patterns: "Method Around Pattern".
 * @param { String } origin - name of the test.
 * @param { TestCallback } callback
 * @return void
 */
const test = (origin, callback) => {
    const assert = Assert();          //    das ok anlegen
    callback(assert);                 //    das ok befüllen
    report(origin, assert.getOk());   //    report mit name und ok aufrufen
};

/** @private */
const bar = extend => document.writeln("+" + "-".repeat(extend) + "+");

/** @private */
const fill = (str, extend) => {
    const len = str.toString().length; // in case str is not a string
    if (len > extend) {
        return str;
    }
    return " ".repeat(extend - len);
};

/** @private */
const padLeft = (str, extend) => "" + fill(str, extend) + str; // todo: use new stdlib function

/** @private */
const padRight = (str, extend) => "" + str + fill(str, extend);

/**
 * @Haskell report :: String, [Bool] -> DOM ()
 * Report reports the list of boolean checks
 * @param { String }    origin - where the reported tests come from
 * @param { [boolean] } ok     - list of applied checks
 */
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
