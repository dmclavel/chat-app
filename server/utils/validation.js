const instanceOfString = str => {
    return typeof str === 'string' && str.trim().length > 0 && str.trim().length < 26;
};

module.exports = {
    instanceOfString
}