
// todo: implement the times function

Number.prototype.times = function(f) {
    return Array.from({length: this}).map( (_item, index) => f(index) );
};


