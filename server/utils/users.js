class Users {
    constructor() {
        this.users = [];
    }

    addUser (id, name, room) {
        const user = { id, name, room };

        this.users.push(user);

        return user;
    }

    removeUser (id) {
        const deletedUser = this.getUser(id)[0], length = this.users.length;

        this.users = this.users.filter(user => user.id !== id);
        
        return length === this.users.length ? [] : deletedUser;
    }

    getUser (id) {
        return this.users.filter(user => user.id === id);
    }

    getUserList (room) {
        let namesArray = []; 
        const users = this.users.filter(user =>  user.room === room);
        users.forEach(user => {
            namesArray = [...namesArray, user.name];
        });
        
        return namesArray;
    }
}

module.exports = {
    Users
}