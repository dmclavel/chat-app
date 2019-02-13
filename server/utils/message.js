const moment = require('moment');

const createMessage = (from, text) => {
    return {
        from, 
        text,
        createdAt: moment().valueOf()
    }
};

const createLocationMessage = (from, lat, lng) => {
    return {
        from,
        url: `https://www.google.com/maps?q=${lat},${lng}`,
        createdAt: moment().valueOf()
    }
};

module.exports = {
    createMessage,
    createLocationMessage
};