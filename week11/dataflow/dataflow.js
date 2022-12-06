
// execute asynchronous tasks in strict sequence, aka "reactive stream", "flux architecture"
const Scheduler = () => {
    let   inProcess = false;
    const tasks = [];

    const process = () => {
        if (inProcess) { return; }
        if (tasks.length < 1 ) { return; }
        inProcess = true;
        const task = tasks.pop();
        new Promise( (resolve, reject) => {
            task(resolve);
        }). then ( () => {
            inProcess = false;
            process();
        });
    } ;

    const add = task => {
        tasks.unshift(task);
        process();
    };
    return { add,
        addOk : task => add( ok => { task(); ok() } )
    }
};


// a dataflow abstraction that is not based on concurrency but on laziness

const DataFlowVariable = howto => {
    let value = undefined;
    return () => undefined === value
                 ? value = howto()
                 : value;
};

