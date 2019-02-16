const expect = require('expect');
const { instanceOfString } = require('./validation');

describe('check for instanceOfString function correctness', () => {
    it('should return false for non-string values', () => {
        const name = 123456, room = 18;

        expect(instanceOfString(name)).toBe(false);
        expect(instanceOfString(room)).toBe(false);
    });

    it('should return false for string with only white spaces', () => {
        const name = '       ', room = '  ';

        expect(instanceOfString(name)).toBe(false);
        expect(instanceOfString(room)).toBe(false);
    });

    it ('should return true for valid string values', () => {
        const name = 'test', room = 'testing room';

        expect(instanceOfString(name)).toBe(true);
        expect(instanceOfString(room)).toBe(true);
    });
});

