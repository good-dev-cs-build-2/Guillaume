require('dotenv').config();
const axios = require('axios');
const sha256 = require('js-sha256');
const BASEURL = 'https://lambda-treasure-hunt.herokuapp.com';
const AUTHTOKEN = process.env.TOKEN;
const compareString = '000000000000000';
let state = {};

generateProof = () => {
    let newProof;
    if (state.rolling) {
        newProof = state.rollingNewProof;
        state.rolling = false;
    } else {
        newProof = state.prevProof + 1;
    }

    const startTime = Date.now();
    console.log(`NewProof: ${newProof}`);
    state.proofHash = sha256(`${state.prevProof}${newProof}`);

    while (!validProof()) {
        newProof++;
        state.proofHash = sha256(`${state.prevProof}${newProof}`);

        if (Date.now() - startTime > 35000) {
            state.rollingNewProof = newProof;
            state.rolling = true;
            getProof();
            return;
        }
    }

    console.log(
        `Difficulty: ${state.difficulty}, NewProof: ${
            state.proofHash
        } in ${(Date.now() - startTime) / 1000} seconds`
    );

    submitProof(newProof);
};

validProof = () => {
    if (
        compareString.includes(state.proofHash.substring(0, state.difficulty))
    ) {
        return true;
    } else {
        return false;
    }
};

getProof = () => {
    axios({
        method: 'get',
        url: `${BASEURL}/api/bc/last_proof/`,
        headers: {
            Authorization: `Token ${AUTHTOKEN}`
        }
    })
        .then(res => {
            state.prevProof = res.data.proof;
            state.difficulty = res.data.difficulty;
            console.log(`Difficulty: ${res.data.difficulty}`);
            console.log(`Previous proof: ${res.data.proof}`);

            setTimeout(generateProof, res.data.cooldown * 1000);
        })
        .catch(err => console.log(err));
};

submitProof = newProof => {
    const proofObject = {
        proof: newProof
    };

    axios({
        method: 'post',
        url: `${BASEURL}/api/bc/mine/`,
        headers: {
            Authorization: `Token ${AUTHTOKEN}`,
            'Content-Type': 'application/json'
        },
        data: proofObject
    })
        .then(res => {
            console.log(res.data);

            setTimeout(getProof, res.data.cooldown * 1000);
        })
        .catch(err => {
            console.log(err);
        });
};

getProof();
