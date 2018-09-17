'use strict';
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


// use crypto-js  (wont use it)
const msg = 'i am user';
const hash = SHA256(msg).toString();
console.log(hash.toString());

const data = {
    id: 4
}

const token = { // some really token
    data,
    hash: SHA256(JSON.stringify(data)+ 'somesecret').toString()
}

const resultHash = SHA256(JSON.stringify(data)+ 'somesecret').toString(); // the token we get from user
if(resultHash === token.hash){
    console.log('correct token');
}else{
    console.log('Data was changed. Do not trust!');
}

// jwt (easily)
const data2 = {
    id: 10
}

const jwt_token = jwt.sign(data2,'123abc');
const decoded = jwt.verify(jwt_token,'123abc');
console.log(decoded)
//{ id: 10, iat: 1537189178 }

const error_ecoded = jwt.verify(jwt_token,'456');
// JsonWebTokenError