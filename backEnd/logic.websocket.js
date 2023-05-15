const port = 8080;  
const express = require('express');
const session = require('express-session');
const cors = require('cors') 
const app = express();
const MongoStore = require('connect-mongo');
const MongoClient = require('mongodb').MongoClient;
const uri = `<URL_MONGODB>`;
const client = new MongoClient(uri, { useNewUrlParser: true });
const { v4: uuidv4 } = require('uuid');


require('dotenv').config();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); 

app.use(session({
    secret: `${process.env.SECRETKEY_SESSION_KEY}`,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: uri, dbName:"Scrum", autoRemove: 'native' })
}));

app.use( (req, res, next) => {
    console.log('req.session', req.session);
    return next();
  });

client.connect(err => {
    const roomCollection = client.db("Scrum").collection("room");
    // perform operations on the collection object
    client.close();
});
const roomCollection = client.db("Scrum").collection("room");
const userCollection = client.db("Scrum").collection("user");
const sessionCollection = client.db("Scrum").collection("sessions");
const ticketCollection = client.db("Scrum").collection("ticket");

function setResponse(type, payload, statusValue)
{
    const response = {
        'type' : type,
        'payload' : payload,
        'status' : statusValue
    }
    console.log(response);
    return response
}

function checkCorrect() {
    response.type = "checking";
    response.payload = {
        "check" : "correct"
    };
    return setResponse("checking", {
        "check" : "correct"
    }, 200);
}

async function createRoom (payload){
    try{

        //TO DO check if values is not null
        // Gathering Data from the Inputs
        const {company_name, team_name, creator_name} = payload;
        const room_id = uuidv4();
        const shareid = uuidv4();
        const sessionId = uuidv4();

        // Makes a dictionary 

        const roomData = {
            id: room_id,
            company_name : company_name,
            team_name: team_name,
            creator_name: creator_name,
            share_link_id: shareid
        }

        //Find if there is any similar Data Entry
        const existingroomCollection = await roomCollection.find({
            company_name : company_name,
            team_name: team_name,
            creator_name: creator_name,
        }).toArray(); 
        if ((existingroomCollection).length == 0){
            //Inserting Data to Collection
            roomCollection.insertOne(roomData);
            
            const userData = {
                name: creator_name,
                room_id:shareid,
                is_creator: true,
                session_id: sessionId
            };
            await userCollection.insertOne(userData);
            return setResponse("create_room", {shareid:shareid, session_id:sessionId}, 200);
        }else{
            const shareid = existingroomCollection[0].share_link_id;
            return setResponse("create_room", {message : "Room Already Created. If want to create New change Name of the Team", shareid : shareid}, 400);
        }
    }catch(error){
        console.log(
            error
        );
        return setResponse("create_room", {message : "error"}, 500);
    }
}

async function isCreator(payload){
    try{
        const session_id = payload.session_id;

        console.log("Values", session_id);

        const userData = await userCollection.find({session_id:session_id}).toArray()
        console.log(userData)
        if(userData.length < 1){
            return setResponse('is_creator', {message: "Session Expired"},400);
        }

        if (userData[0].is_creator){
            return setResponse('is_creator', {"creator" : true}, 200);
        }
        else{    
            return setResponse('is_creator', {"creator" : false}, 200);
        }

    }catch (error){
        console.log(error);
        return setResponse('is_creator', {message : "error"}, 500);
    }
}

async function joinRoom(payload){
    try{
        const name = payload.name;
        const id = payload.id;
        const session_id = payload.hasOwnProperty('session_id') ? payload.session_id : uuidv4();

        const userData = {
            name: name,
            room_id:id,
            is_creator: false
        };
        
        const exisitnguserCollection = await userCollection.find(userData).toArray();
        console.log(exisitnguserCollection)
        if ((exisitnguserCollection).length < 1){
            console.log("userData", userData);
            userData.id = uuidv4();
            userData.session_id = session_id;
            await userCollection.insertOne(userData);
            return setResponse('join_room', {session_id : session_id}, 200);
        }else{
            console.log("Handle Exisiting ", exisitnguserCollection[0]);
            if (session_id == exisitnguserCollection[0].session_id){
                return setResponse('join_room', {message : "Already Logged In"}, 200);
            }
            else{
                return setResponse('join_room', {message : "Session Expire, or Please Select Other Name"}, 400);  
            }
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({message : "error"})
    }
}

async function createTicket(payload){
    try
    {
        const id = payload.id;
        const name = payload.name;

        const ticket_id = uuidv4();
        const ticketData = {
            id : ticket_id,
            name : name,
            votes : {},
            room_id: id
        }
        await ticketCollection.insertOne(ticketData);
        return setResponse("create_ticket", {ticket_id, name}, 200);

    }
    catch (error) {
        console.log("error");
        return setResponse("create_ticket", {message : "error", name : ""}, 500)
    }
}

async function createVote(payload){
    try{
        const id = payload.id;
        const room_id = payload.room_id
        const value = payload.value;
        const session_id = payload.hasOwnProperty('session_id') ? payload.session_id : uuidv4();
        //Add check session expired or not. 

        const currentuserData = await userCollection.find({session_id:session_id}).toArray();
        if (currentuserData.length < 1){
            return setResponse("vote", {message:"User Dont Exist"}, 400);
        }

        const currentticketData = await ticketCollection.find({id:id, room_id:room_id}).toArray();
        if (currentticketData.length < 1){
            return setResponse("vote", {message:"Ticket Doen't Exist"}, 400);
        }

        const userName = currentuserData[0].name;
        console.log(userName)
        const existingVote = currentticketData[0].votes;
        existingVote[userName] = value;
        ticketCollection.updateOne( { id: id, room_id:room_id },
        {
            $set: {
                votes : existingVote
            }
        });

        return setResponse("vote", {
            name:userName,
            value:value, 
            ticket_name : currentticketData[0].name
        }, 200);

    }catch(error){
        console.log("Error", error);
        return setResponse("vote", {message:"error"}, 500);
    }
}

async function getName(payload){
    try{
        console.log("GEt Data")
        const session_id = payload.session_id

        userData = await userCollection.find({session_id : session_id}).toArray()
        if (userData.length == 1){
            return setResponse('get_name', {"name" : userData[0].name}, 200)
        }
        else{
            return setResponse('get_name', {message : "error", name:""}, 500)
        }

    }catch(error){
        console.log(error)
    }
}

async function getAllName(payload){
    try{
        console.log("GEt Data")
        const room_id = payload.room_id

        userData = await userCollection.find({room_id : room_id}).toArray()
        if (userData.length > 0){
            const nameList = userData.map((item) => item.name);
            return setResponse('get_all_name', {"name" : nameList}, 200)
        }
        else{
            return setResponse('get_all_name', {"name" : []}, 500)
        }

    }catch(error){
        console.log(error)
    }
}


module.exports  = {
    createRoom,
    isCreator,
    joinRoom,
    createTicket,
    createVote, 
    getName,
    getAllName,
    checkCorrect
}
