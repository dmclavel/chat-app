const expect = require('expect');
const { createMessage, createLocationMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate a correct message object', () => {
        const from = "test";
        const text = "from test";
        const message = createMessage(from, text);

        expect(typeof message.createdAt).toBe('number');    //make sure timestamp is a number
        expect(message).toMatchObject({ from, text });
    });
});

describe('generateLocationMessage', () => {
    it('should generate a correct url', () => {
        const lat = 1.1111;
        const lng = 1.1111;
        const expectedUrl = `https://www.google.com/maps?q=${lat},${lng}`;
        const message = createLocationMessage('from test', lat, lng);

        expect(typeof message.createdAt).toBe('number');    //make sure timestamp is a number
        expect(message.url).toBe(expectedUrl);
    });
});