import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { socket } from './socket';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import green from '@material-ui/core/colors/green';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';
import { Fab } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@material-ui/core';
import { Snackbar } from '@material-ui/core';


import { CircularProgress, Box } from '@material-ui/core';

const Timer = ({ onEnd }) => {
    const [progress, setProgress] = useState(0);
    const timerDuration = 30; // duration in seconds
  
    useEffect(() => {
      const timer = setInterval(() => {
        if (progress >= 100) {
          clearInterval(timer);
          setProgress(0);  // reset progress
          onEnd();  // invoke onEnd callback when timer completes
        } else {
          setProgress(prevProgress => prevProgress + 100/timerDuration);
        }
      }, 1000);
  
      return () => {
        clearInterval(timer);
      };
    }, [progress, onEnd]);  // add onEnd to the dependency array
  

  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={progress} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">Time Remaining</Typography>
      </Box>
    </Box>
  );
}


const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//     justifyContent: 'center', // Center items on the horizontal axis
//     alignItems: 'center', // Center items on the vertical axis
//     height: '100vh', // Full height
//   },
root: {
    width: '100%',
    display: 'flex',
    overflow: 'auto',
    minHeight: '100vh',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  container1: {
    width: '100%',
    height: 1002,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  userPanel: {
    height: '100%',
  },
  mainPanel: {
    height: '68vh', // set your desired height
    width: '250vh',  // set your desired width
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  }, 
  timerPanel: {
    height: '15vh', // set your desired height
    width: '250vh',  // set your desired width
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    wordWrap: 'break-word'
  },
  bottomPanel: {
    height: '10vh', // set your desired height
    width: '250vh',  // set your desired width
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
  },
  drawerPaper: {
    width: 240,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  online: {
    color: '#fff',
    backgroundColor: green[500],
  },
  bottom: {
    marginTop: 'auto', // Pushes the content to the bottom
  }, 
  fullwidthCard: {
    width: '100%',
  },
  button: {
    margin: theme.spacing(5),
  },
  formContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  form: {
    display: 'flex',
    flexGrow: 1,
    marginRight: theme.spacing(2),
  },
  inputField: {
    flex: 1,
  },
  buttonContainer: {
    display: 'flex',
  },
  submitButton: {
    marginLeft: theme.spacing(1),
  },
  closeButton: {
    // Add any additional styling for the close button
  },copyLinkButtonContainer: {
    position: 'absolute',
    bottom: theme.spacing(2),
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },snackbarRoot: {
    minWidth: 200, // Adjust the width to your desired value
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.primary.main,
  },
  snackbarMessage: {
    padding: theme.spacing(1), // Adjust the padding to your desired value
    fontSize: '0.8rem', // Adjust the font size to your desired value
  },
  
}));

const Dashboard = () => {
    const classes = useStyles();
    const [sessionId, setSessionId] = useState(localStorage.getItem("session_id"));
    const [roomId, setRoomId] = useState(localStorage.getItem("room_id"));
    const [ticketID, setTicketId] = useState('');
    const [usersList, setUsersList] = useState([]);
    const [isCreatorMessage, setIsCreatorMessage] = useState(false);
    const [CreatorMessage, setCreatorMessage] = useState({});
    const [isJoinRoom, setIsJoinRoom] = useState(false);
    const [isVote, setIsVote] = useState(0);
    const [VoteList, setVoteList] = useState({});
    const [isCreator, setIsCreator] = useState(false);
    const [ticketName, setTicketName] = useState('');
    const [ticketValue, setTicketValue] = useState('');
    const [isNewMessage, setIsNewMessage] = useState(false);
    const [newMessage, setNewMessage] = useState({});
    const navigate = useNavigate();
    const [disabled, setDisabled] = useState(false);
    const [showTimer, setShowTimer] = useState(false);  // New state variable
    const [timerEnded, setTimerEnded] = useState(false);  // State variable to track if timer has ended
    const [timerKey, setTimerKey] = useState(0);
    
    socket.on('message', (data) => {
        setNewMessage(data);
        setIsNewMessage(true)
    });
    console.log("IS Creator:", isCreator)
    
    useEffect(()=>{
        const isCreator = async() => {
            socket.emit('message', {
                type : "is_creator",
                payload : {
                    session_id : localStorage.getItem("session_id")
                }
            });
        }
        isCreator();
    }, []);

    useEffect(()=>{
        const getData = async() => {
            const data = newMessage
            if (data.type == 'is_creator'){ setCreatorMessage(data.payload)}
            if (data.type == 'join_room'){ setIsJoinRoom(true) }
            if (data.type == 'get_all_name'){ setUsersList(data.payload.name)}
            if (data.type == 'get_name'){ }
            if (data.type == 'vote'){setIsVote(isVote => isVote + 1);}
            if (data.type == 'create_ticket'){setTicketValue(data.payload.name); 
                restartTimer();
                setDisabled(false); 
                setTicketId(data.payload.ticket_id); 
                setShowTimer(true); 
                setTicketName(data.payload.name);
                setIsVote(0);
            }
            if (data.type == 'get_all_ticket'){
              setVoteList(data.payload)
            }
            if(data.type == "close_room"){
              if(!isCreator){
                localStorage.removeItem("session_id");
                localStorage.removeItem("room_id");
                setSessionId("");
                setRoomId("");
                navigate("/")
              }
              else{
                navigate("/vote")
              }
            }
        }
        getData();
        setIsNewMessage(false)
    }, [isNewMessage]);


    useEffect(()=>{
        const data = CreatorMessage;
        console.log("Creator Message", data)
        if (data.creator){
            setIsCreator(data.creator);
        }
        setIsCreatorMessage(false);
    }, [CreatorMessage]);

    useEffect(()=>{
      const data = VoteList;
      console.log("Vote Data", data)
      
  }, [VoteList]);

    useEffect(()=>{
        console.log("Room ID:",roomId)
        console.log("Session ID:",sessionId)
        socket.emit('message', {
            type : "get_all_name",
            payload : {
                room_id : roomId,  
            }
        });
        setIsJoinRoom(false)
    }, [isJoinRoom]);

    const handleSubmit = async(event) => {
        try{
            event.preventDefault();
            socket.emit('message', 
            {
                "type" : "create_ticket",
                "payload" : {
                    id:roomId,
                    name:ticketName
                }
            })

        }
        catch(error){
            console.log("error")
        }
    };


  // handler for button click
  const handleClick = (value) => {
    setDisabled(true);
    socket.emit("message", 
        {
            type: "vote",
            payload : {
                id: ticketID,
                room_id : roomId,
                value: value,
                session_id : sessionId
            }
        }
    );
  };

  const handleTimerEnd = () => {
    setTimerEnded(true);  // Set timerEnded to true when timer completes
    setTicketValue('');
    setShowTimer(false);
    setDisabled(true);
  };

  const restartTimer = () => {
    setShowTimer(false); // hide timer
    setTimerKey(prevKey => prevKey + 1); // increment key
    setShowTimer(true); // show timer
  };

  const handleCloseRoom = () => {
    socket.emit("message", 
    {
        type: "close_room",
        payload : {
            room_id : roomId,
            session_id : sessionId
        }
    }
  );
  
  };

  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const handleCopyLink = () => {
    const url = roomId; // Replace with your actual URL
    navigator.clipboard.writeText(url)
      .then(() => {
        setIsLinkCopied(true);
        setTimeout(() => {
          setIsLinkCopied(false);
        }, 2000); // Display the notification for 2 seconds
      })
      .catch((error) => {
        console.error('Failed to copy link:', error);
      });
  };

  return ( 
<div className={classes.root}>
    <Grid container style={{ height: '100%' }}>
      <Grid item xs={2} className={classes.userPanel}>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
        <List>
          {usersList.length > 0 ? (
            usersList.map((user, index) => (
              <ListItem button key={index}>
                <ListItemAvatar>
                  <Avatar className={classes.online}>
                    {user[0].toUpperCase()} {/* First letter of user name */}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user}
                  secondary={<Typography variant="body2" color="textSecondary">Online</Typography>}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="Waiting for users..." />
            </ListItem>
          )}
        </List>
        <div className={classes.copyLinkButtonContainer}>
        <Button className={classes.copyLinkButton} onClick={handleCopyLink}>
                Copy Link
              </Button>
              {isLinkCopied && (
                <Snackbar
                open={isLinkCopied}
                autoHideDuration={2000}
                onClose={() => setIsLinkCopied(false)}
                message="Link copied!"
                ContentProps={{
                  classes: {
                    root: classes.snackbarRoot,
                    message: classes.snackbarMessage,
                  },
                }}
              />
              )}
      </div>
      </Drawer>
    </Grid>
  </Grid>
  <Grid item xs={8} style={{ height: '100%' }}>
        <Grid container style={{ height: '100%' }}>
        <Grid item xs={12} className={classes.mainPanel}>
        {
            ticketValue.length > 0 ? (
            <div>
            <Typography variant="h2" align="center">{ticketValue}</Typography>
            <Typography align="center">Number of votes: {isVote/2}</Typography>
            </div>
            ) : (
            <Typography variant="h5" align="center">Waiting for Host to Post Ticket</Typography>
            )
        }
        </Grid>
        <Grid item xs={12} className={classes.timerPanel}>
          {showTimer && <Timer key={timerKey} onEnd={handleTimerEnd} />}
        </Grid>
          <Grid item xs={12} className={classes.bottomPanel}>
            <Card className={classes.fullwidthCard}>
              <CardContent>
                <center>
            {isCreator ? (
              <div className={classes.formContainer}>
              <form className={classes.form} onSubmit={handleSubmit}>
                <TextField
                  className={classes.inputField}
                  label="Ticket Name"
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  InputProps={{ style: { fontSize: 30 } }}
                />
              <div className={classes.buttonContainer}>
                <Button type="submit" onSubmit={handleSubmit} className={classes.submitButton}  >
                  Submit
                </Button>
                <Button className={classes.closeButton} onClick={handleCloseRoom}>
                  Close Room
                </Button>
              </div>
              </form>
            </div>
            ) : (
                <div>
                    {['1', '2', '3', '5', '8'].map((value) => (
                        <Button
                            className={classes.button}
                            variant="outlined"
                            color="default"
                            disabled={disabled}
                            onClick={() => handleClick(value)}
                        >
                            {value}
                        </Button>
                    ))}
                </div>
            )}
            </center>
            </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
  </div>
  );
};

export default Dashboard;
