import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from './socket';
import { TextField, Button, Container, Typography, makeStyles, Card, CardContent, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    gridContainer: {
      width: '80%',
      justifyContent: 'space-between',
    },
    card: {
      width: '45%',
      padding: theme.spacing(2),
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(2, 0, 2),
      backgroundColor: '#3f51b5',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#303f9f',
      },
    },
    title: {
      marginBottom: theme.spacing(2),
      color: '#3f51b5',
      fontWeight: 600,
    },
  }));
  

function CreateRoom() {
    const [companyName, setCompanyName] = useState('');
    const [teamName, setTeamName] = useState('');
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    const classes = useStyles();

    useEffect( () => {
        const roomId = localStorage.getItem("room_id");
        const sessionId = localStorage.getItem("session_id")
        if (roomId === undefined || sessionId === undefined || roomId === "" || sessionId === ""){
            navigate('/dashboard')
        }
    }, [])

    const handleSubmit = async(event) => {
      try{
        event.preventDefault(); 

        socket.emit('message', 
        {
            "type" : "create_room",
            "payload" : {
                company_name : companyName,
                team_name: teamName,
                creator_name: userName
            }
        })

        socket.on('message', (createRoomResponse) => {
            console.log(createRoomResponse);
            console.log(createRoomResponse.payload);
            if(createRoomResponse.payload != {}  & createRoomResponse.type === "create_room"){
                if (!localStorage.getItem("room_id") & !localStorage.getItem("session_id")){
                    localStorage.setItem("room_id", createRoomResponse.payload.shareid)
                    localStorage.setItem("session_id", createRoomResponse.payload.session_id)
            }
                navigate(`/dashboard`);
            }
        });

      }catch(error){
        console.log(error);
      }
    };
    return (
        <div className={classes.root}>
          <Card className={classes.card}>
            <CardContent>
              <Container component="main" maxWidth="xs">
                <Typography component="h1" variant="h4" align="center" className={classes.title}>
                  Create Room
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <TextField 
                        variant="outlined"
                        required
                        fullWidth
                        id="companyName"
                        label="Company Name"
                        name="companyName"
                        autoComplete="companyName"
                        autoFocus
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField 
                        variant="outlined"
                        required
                        fullWidth
                        id="teamName"
                        label="Team Name"
                        name="teamName"
                        autoComplete="teamName"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                      />
                    </Grid>
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
                    className={classes.submit}
                  >
                    Create Room
                  </Button>
                </form>
              </Container>
            </CardContent>
          </Card>
        </div>
      );
  }

  const JoinRoomForm = () => {
    const classes = useStyles();
    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    
    useEffect( () => {
        localStorage.clear()
    }, [])

    const handleSubmit = (event) => {
      event.preventDefault();
        try {
            console.log("Room ID", roomId)
            event.preventDefault();
            socket.emit('message', {
                    type : "join_room",
                    payload : {
                        name : userName,
                        id:roomId
                }
            })

            socket.on('message', (joinRoomResponse) => {
                console.log(joinRoomResponse);
                if (!localStorage.getItem("room_id") & !localStorage.getItem("session_id")){
                    localStorage.setItem("room_id", roomId)
                    localStorage.setItem("session_id", joinRoomResponse.payload.session_id)
                }

                navigate('/dashboard');
                
            });
        } catch (error) {
            console.log(error);
        }
    };
  
    return (
        <div className={classes.root}>
        <Card className={classes.card}>
          <CardContent>
            <Container component="main" maxWidth="xs">
              <Typography component="h1" variant="h4" align="center" className={classes.title}>
                Join Room
              </Typography>
              <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="roomId"
                      label="Room Id"
                      name="roomId"
                      autoComplete="roomId"
                      autoFocus
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                    />
                  </Grid>
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
                  className={classes.submit}
                >
                  Join Room
                </Button>
              </form>
            </Container>
          </CardContent>
        </Card>
      </div>
      
    );
  };

  const MainPage = () => {
    const classes = useStyles();
  
    return (
      <div className={classes.root}>
        <Grid container spacing={0}>
          {/* Existing CreateRoomForm component */}
          <Grid item xs={12} sm={6} justifyContent='right' >
            <CreateRoom />
          </Grid>
          {/* New JoinRoomForm component */}
          <Grid item xs={12} sm={6} justifyContent='left'>
            <JoinRoomForm />
          </Grid>
        </Grid>
      </div>
    );
  };


export default MainPage;