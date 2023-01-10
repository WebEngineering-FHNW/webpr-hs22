// https://stackoverflow.com/questions/10993824/do-something-n-times-declarative-syntax

export { arab };
const timesFunction = function(callback) {
  if( isNaN(parseInt(Number(this.valueOf()))) ) {
    throw new TypeError("Object is not a valid number");
  }
  for (let i = 0; i < Number(this.valueOf()); i++) {
    callback(i);
  }
};

String.prototype.times = timesFunction;
Number.prototype.times = timesFunction;

/** @private */
const romanToNumberMap = {
    'IV': 4,
    'IX': 9,
    'XL': 40,
    'XC': 90,
    'CD': 400,
    'CM': 900,
    'I': 1,
    'V': 5,
    'X': 10,
    'L': 50,
    'C': 100,
    'D': 500,
    'M': 1000
};

/**
 * @param  { !String } roman      - a roman number as a string, mandatory
 * @return { undefined | Number } - the arabic number or undefined if the roman number is invalid
 * @throws { Error } if the number is not a valid roman number
 * @example
 * arab("MDCXXXII") === 1632
 */
const arab = roman => {
    if (roman.length === 0) return 0;

    for (const [key, value] of Object.entries(romanToNumberMap)) {
        const len = key.length;
        if (roman.startsWith(key)) return value + arab(roman.slice(len));
    }
    throw new Error('Invalid Roman numeral: ' + roman);
};
