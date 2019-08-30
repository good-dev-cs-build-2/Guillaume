class Room {
    constructor(title, description, room_id = 0, x = null, y = null) {
        this.title = title;
        this.n_to = null;
        this.s_to = null;
        this.w_to = null;
        this.e_to = null;
        this.x = x;
        this.y = y;
        this.description = description;
        this.room_id = room_id;
    }
    addExits() {
        const exits = [];
        if (this.n_to) exits.push('n');
        if (this.s_to) exits.push('s');
        if (this.w_to) exits.push('w');
        if (this.e_to) exits.push('e');

        return exits;
    }
    printExits() {
        return `Exits: [{${this.addExits()}}]`;
    }
    connectRooms(direction, destination) {
        if (direction === 'n') {
            destination.s_to = this;
        } else if (direction === 's') {
            destination.s_to = this;
        } else if (direction === 'w') {
            destination.w_to = this;
        } else if (destination === 'e') {
            destination.e_to = this;
        } else {
            console.log('INVALID ROOM CONNECTION');
            return;
        }
    }
    getCoords() {
        return [this.x, this.y];
    }
}

class Graph {
    constructor() {
        this.adjacencyList = {};
        this.rooms = [];
    }
    addRoom(roomName) {
        let newRoom = Room(roomName);
        if (!this.adjacencyList[newRoom]) this.adjacencyList[newRoom] = [];
        return;
    }

    depthFirstSearch(array) {
        array.push(this.rooms);
        for (let i = 0; i < this.room.length; i++) {
            this.depthFirstSearch(this.room[i]);
        }
        return this.room;
    }
}

module.exports = { Graph, Room };
