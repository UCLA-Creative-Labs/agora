const strings = () => {

    // takes in string of form "[1,2,3]"" or "["hi", "hello"]" 
    // and returns their corresponding arrays
    /* params (string, type) */
    const toArray = (inputString, type) => {
        return inputString.slice(1,inputString.length-1).split(',').map(type);
    }

    return {
        toArray
    }
};

module.exports = {strings};
