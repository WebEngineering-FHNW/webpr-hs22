const funArray = [];

funArray.push("true");
funArray.push( (1===1).toString() )

function fun1() { return 1; }

funArray.push( (fun1() === 1).toString() );
funArray.push( (fun1(42) === 1).toString() );

function fun2() { return 1; }
function fun2(arg) { return arg; }

funArray.push( (fun2() !== 1).toString() );
funArray.push( (fun2() === undefined).toString() );
funArray.push( (fun2(42) === 42).toString() );
funArray.push( (fun2(1) === 1).toString() )

function noReturn() { 1; }
const noReturn2 = () => { 1; }
const noReturn3 = () => 1;

funArray.push( (noReturn() !== 1).toString() );
funArray.push( (noReturn2() !== 1).toString() );
funArray.push( (noReturn3() === 1).toString() );

const myfun = fun1;
const funs = [null, undefined, fun1, fun2];

funArray.push( (myfun() === 1).toString() );
funArray.push( (funs[2]() === 1).toString() );

function doit(whatToDo) {
    return function bla(arg) { return whatToDo(arg); }
}

funArray.push( (doit(fun1)(10) === 1).toString() )
funArray.push( (doit(fun2)(10) === 10).toString() )

const doit2 = callme => arg => callme(arg);

funArray.push( (doit2(fun1)(10) === 1).toString() )

const doFun2 = doit2(fun1);

funArray.push( (doFun2(10) === 1).toString() )
funArray.push( (doFun2() === 1).toString() )

funArray.forEach((e, i) => {
    document.writeln(i + ": ");
    document.writeln(e + '<br/>');
});