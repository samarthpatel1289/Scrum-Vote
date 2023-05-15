const port = 8080;  
const express = require('express');
const session = require('express-session');
const cors = require('cors') 
const app = express();
const MongoStore = require('connect-mongo');
const MongoClient = require('mongodb').MongoClient;
const uri = `<YOURMONGODBURL>`;
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

app.post("/create_room", async (req, res) => {
    try{

        //TO DO check if values is not null
        // Gathering Data from the Inputs
        const {company_name, team_name, creator_name} = req.body;
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
                room_id:room_id,
                is_creator: true,
                session_id: sessionId
            };
            await userCollection.insertOne(userData);
            req.session.session_id = sessionId;
            req.session.save();
            return res.status(200).json({shareid});
        }else{
            const shareid = existingroomCollection[0].share_link_id;
            return  res.status(400).json({message : "Room Already Created. If want to create New change Name of the Team", shareid : shareid})    
        }
    }catch(error){
        console.log(
            error
        );
        return res.status(500).json({message : "error"})
    }
});

app.get('/is_creator', async (req, res) => {
    try{
        const session_id = req.session.session_id;

        console.log("Values", session_id);

        const userData = await userCollection.find({session_id:session_id}).toArray()
        console.log(userData)
        if(userData.length < 1){
            return res.status(400).json({message: "Session Expired"})
        }

        if (userData[0].is_creator){
            return res.status(200).json({"creator" : true})
        }
        else{    
            return res.status(200).json({"creator" : false})
        }

    }catch (error){
        console.log(error);
    }
});

app.post('/join_room/:id', async (req, res) => {
    try{
        const {name} = req.body;
        const {id} = req.params;

        const sessionId = uuidv4();
        const userData = {
            name: name,
            room_id:id,
            is_creator: false
        };
        
        const exisitnguserCollection = await userCollection.find(userData).toArray();
        
        if ((exisitnguserCollection).length < 1){
            console.log("userData", userData);
            userData.id = uuidv4();
            userData.session_id = sessionId;
            await userCollection.insertOne(userData);
            console.log(sessionId)
            req.session.session_id = sessionId;
            return res.status(200).json({message : "Logged In", });
        }else{
            console.log("Handle Exisiting ", exisitnguserCollection[0]);
            console.log("Data", req.session.session_id);
            if (req.session.session_id == exisitnguserCollection[0].session_id){
                return res.status(200).json({message : "Already Logged In"});
            }
            else{
                return res.status(400).json({message : "Session Expire"})        
            }
            
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({message : "error"})
    }
});

app.post('/create_ticket/:id', async (req, res) => {
    try
    {
        const {id} = req.params;
        const {name} = req.body;

        const ticket_id = uuidv4();
        const ticketData = {
            id : ticket_id,
            name : name,
            votes : {},
            room_id: id
        }
        ticketCollection.insertOne(ticketData);
        return res.status(200).json({message : "Ticket Generated", ticket_id});

    }
    catch (error) {
        console.log("error");
        return res.status(500).json({message : "error"})
    }
});

app.get('/room/:id', async(req, res)=>{
    try{
        const {id} = req.params;

        const existingroomData = await roomCollection.find({share_link_id:id}).toArray()
        if (existingroomData.length < 1){
            return res.status(400).json({message:"Ticket Doesn't Exist"})
        }

        return res.status(200).json({data:existingroomData[0]})
    }
    catch(error)
    {
        console.log("error");
        return res.status(500).json({message:"Eror"})
    }
});

app.post('/vote/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const {value} = req.body;
        const session_id = req.session.session_id;
        console.log(session_id);
        console.log(id);

        //Add check session expired or not. 

        const currentuserData = await userCollection.find({session_id:session_id}).toArray();
        if (currentuserData.length < 1){
            return res.status(400).json({message:"User Dont Exist"})
        }

        const currentticketData = await ticketCollection.find({id:id}).toArray();
        if (currentticketData.length < 1){
            return res.status(400).json({message: "Ticket Doen't Exist"})
        }

        const userName = currentuserData[0].name;
        const existingVote = currentticketData[0].votes;
        existingVote[userName] = value;
        ticketCollection.updateOne( { id: id },
        {
            $set: {
                votes : existingVote
            }
        });

        return res.status(200).json({message:"Vote"});

    }catch(error){
        console.log("Error", error);
        return res.status(500).json({message : "error"})
    }
});

function averageVote(votes){
    var sum = 0
    var avg = 0;
    for (const name in votes){
        if (Object.hasOwnProperty.call(votes, name)){

            sum+= parseInt(votes[name]);
        }
    }
    avg = Math.floor(sum / Object.keys(votes).length);
    return avg;
}

app.get('/ticket/:id', async (req, res) => {
    try{
        const {id} = req.params;
        
        const exisitngTicketData = await ticketCollection.find({id:id}).toArray();
        if (exisitngTicketData.length < 1){
            return res.status(400).json({message : "The Id Doesn't Exist"});
        }

        const average = averageVote(exisitngTicketData[0].votes);
        exisitngTicketData[0]['averageVote'] = average;
        return res.status(200).json({data: exisitngTicketData[0]});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message: "Error"});
    }
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
