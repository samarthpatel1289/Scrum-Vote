import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    useParams,
  } from "react-router-dom";
import './App.css'
import { socket } from './socket';
import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Drawer, List, ListItem, ListItemText, IconButton, Typography, Container, Grid } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Avatar from '@material-ui/core/Avatar';
import green from '@material-ui/core/colors/green';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },drawer: {
    width: '300px', // Adjust as needed
  },
  drawerContent: {
    padding: theme.spacing(2), // Adjust as needed
  },
}));

const JoinRoomForm = () => {
    const navigate = useNavigate();
    const classes = useStyles();
    const [usersList, setUsersList] = useState([]);
  const [userName, setUserName] = useState('');
  const [isCreator, setIsCreator] = useState(false);

  
  const { room_id } = useParams();

  function addUserToList(newUser) {
    if (!usersList.includes(newUser)) {
      setUsersList([...usersList, newUser]);
    }
  }

  useEffect(() => {
    const fetchIsCreator = async () => {
      try {
        const session_id = localStorage.getItem('session_id')
        const room_id = localStorage.getItem('room_id') ? localStorage.getItem('room_id') : undefined
        if (session_id != null){
            socket.emit('message', {
                type : "is_creator",
                payload : {
                    session_id,
                    id:room_id
                }
            })

            socket.on('message', (data) => {
                if(data.type === 'is_creator'){
                    setIsCreator(data.payload.creator)
                }

                if (isCreator){
                    navigate('/dashboard');
                }
                if(data.type == 'join_room'){
                    const anotherUseSessionId = data.payload.session_id 
                    socket.emit('message', {
                        type : "get_name",
                        payload : {
                            room_id : room_id,  
                            session_id:anotherUseSessionId,
                    }
                    })
                }
                if(data.type === 'get_all_name'){
                    addUserToList(data.payload.name);
                    console.log(userName);
                }
            });
        }


      } catch (error) {
        console.log(error);
      }
    };
    fetchIsCreator();
  }, [room_id, usersList, isCreator]);


  const handleSubmit = async (event) => {
    try {
        console.log("Room ID", room_id)
      event.preventDefault();
        socket.emit('message', {
                type : "join_room",
                payload : {
                    name : userName,
                    id:room_id
            }
        })

        socket.on('message', (joinRoomResponse) => {
            console.log(joinRoomResponse);

            navigate('/dashboard');
            
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputFocus = (event) => {
    event.target.placeholder = '';
  };

  const handleInputBlur = (event) => {
    event.target.placeholder = 'User Name';
  };

    const [showSidebar, setShowSidebar] = useState(false);

  const handleClick = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.formContainer}>
        <IconButton onClick={() => setShowSidebar(!showSidebar)}>
          <NotificationsIcon />
        </IconButton>
        <Drawer anchor="right" open={showSidebar} onClose={() => setShowSidebar(false)} classes={{ paper: classes.drawer }}>
        <div className={classes.drawerContent}>
            <Button
                variant="contained"
                color="primary"
                startIcon={<FileCopyIcon />}
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                >
                Copy Link
            </Button>
            <List>
            {usersList.length > 0 ? (
                usersList.map((user) => (
                <ListItem >
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
        </div>
        </Drawer>
        <Typography component="h1" variant="h5">
          Join Room
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                variant="outlined"
                required
                fullWidth
                id="userName"
                label="User Name"
                name="userName"
                autoComplete="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Join Room
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default JoinRoomForm;



