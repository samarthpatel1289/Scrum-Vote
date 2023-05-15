const { MongoDriverError } = require("mongodb");

const response = {
    "type" : "",
    "payload" : {}
}

function check_correct() {
    response.type = "checking";
    response.payload = {
        "check" : "correct"
    };
    return response;
}

function stringify(response){
    const stringResponse = JSON.stringify(response);
    const encoder = new TextEncoder();
    return encoder.encode(stringResponse);
}

module.exports = {
    check_correct,
    stringify
}