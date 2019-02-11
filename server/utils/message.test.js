const expect = require('expect');
const { createMessage } = require('./message');

describe('generateMessage', () => {
    it('should generate a correct message object', () => {
        const from = "test";
        const text = "from test";
        const message = createMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({ from, text });
    });
});