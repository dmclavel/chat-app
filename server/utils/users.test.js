const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Mike',
            room: 'Node JS'
        }, {
            id: '2',
            name: 'Gio',
            room: 'React JS'
        }, {
            id: '3',
            name: 'Stacy',
            room: 'Node JS'
        }];
    });

    it('should add new user', () => {
        const users = new Users();
        const user = {
            id: '124212',
            name: 'test',
            room: 'testing room'
        }
        const res = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([res]);
    });

    it('should remove a user named Mike', () => {
        const updatedUsers = users.removeUser('1');

        expect(updatedUsers).toEqual({
            id: '1',
            name: 'Mike',
            room: 'Node JS'
        });
    });

    it('should not remove user', () => {
        const updatedUsers = users.removeUser('NOTEXISTING');

        expect(updatedUsers).toEqual([]);
    });

    it('should find user named Gio', () => {
        const user = users.getUser('2');

        expect(user).toEqual([{
            id: '2',
            name: 'Gio',
            room: 'React JS'
        }]);
    });

    it('should not find user', () => {
        const user = users.getUser('NOTEXISTING');

        expect(user).toEqual([]);
    });

    it('should return names for Node JS', () => {
        const userList = users.getUserList('Node JS');

        expect(userList).toEqual(['Mike', 'Stacy']);
    });

    it('should return names for React JS', () => {
        const userList = users.getUserList('React JS');

        expect(userList).toEqual(['Gio']);
    });
});