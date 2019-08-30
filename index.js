const express = require('express');
const axios = require('axios');

const server = express();
const { Graph, Room } = require('./graph');

server.use(express.json());

const PORT = 5000 || process.env.PORT;

let room0;
axios
    .get('https://lambda-treasure-hunt.herokuapp.com/api/adv/init/', {
        headers: {
            Authorization: 'Token 08e7b96e543705a81f1b734abbbfac995f83ccf2'
        }
    })
    .then(({ data: { title, room_id, description } }) => {
        return { title, room_id, description };
    })
    .catch(({ message }) => console.log(message));

server.listen(PORT, () =>
    console.log(`*** Server is listening on port: ${PORT} ***`)
);
