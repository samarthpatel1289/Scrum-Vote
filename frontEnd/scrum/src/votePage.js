import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import Button from '@material-ui/core/Button';

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
        minHeight: '10vh',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      },
      mainPanel: {
        height: '68vh',
        width: '500vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: theme.spacing(4), // Add padding to create space around the main panel
      },
      table: {
        margin: '0 auto',
        borderCollapse: 'separate',
        borderSpacing: '0 8px', // Adjust the spacing between cells
        width: '100%',
        textAlign: 'center',
        fontSize: '1.2rem',
      },
      tableCell: {
        padding: theme.spacing(2),
        border: '1px solid #ddd', // Add border to cells
      },
      card: {
        width: '80%',
        margin: '0 auto',
        marginTop: theme.spacing(4),
        padding: theme.spacing(4),
      },
      cardContent: {
        padding: theme.spacing(2),
      },
      fontSizeLarge: {
        fontSize: '1.5rem',
      },
      
    }));

const VotePage = () => {
    const classes = useStyles();
    const [sessionId, setSessionId] = useState(localStorage.getItem("session_id"));
    const [roomId, setRoomId] = useState(localStorage.getItem("room_id"));
    const [VoteList, setVoteList] = useState({});
    const [newMessage, setNewMessage] = useState({});
    const [isCreator, setIsCreator] = useState(false);
    const navigate = useNavigate();


    useEffect(()=>{
        socket.emit('message', {
            type : "get_all_ticket",
            payload : {
                session_id : sessionId,
                room_id : roomId
            }
        });

        socket.emit('message', {
            type : "is_creator",
            payload : {
                session_id : sessionId
            }
        });

        
    }, []);

    socket.on('message', (data) => {    
        setNewMessage(data);
    });

    useEffect(()=>{
        const data = newMessage;
        if (data.type == 'get_all_ticket'){setVoteList(data.payload.ticketData)  }
        if (data.type == 'is_creator'){ setIsCreator(data.payload.creator);}
    }, [newMessage])

    const handleSubmit = () => {
        localStorage.removeItem("session_id");
        localStorage.removeItem("room_id");
        setSessionId("");
        setRoomId("");
        navigate("/")        
    };

    return (
      <div className={classes.root}>
      <Grid item xs={8} style={{ height: '100%' }}>
        <Grid container style={{ height: '100%' }}>
          <Grid item xs={12} className={classes.mainPanel}>
            {isCreator ? (
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <center>
                    <div>
                      <table className={classes.table}>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Average Vote</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(VoteList) &&
                            VoteList.map((row) => (
                              <tr key={row.id}>
                                <td className={classes.tableCell}>{row.name}</td>
                                <td className={classes.tableCell}>{row.averageVotes}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </center>
                </CardContent>
                <CardContent>
                <Button className={classes.closeButton} onClick={handleSubmit}>
                  Close Room
                </Button>
                </CardContent>
              </Card>
            ) : (
              <div></div>
            )}
          </Grid>
        </Grid>
      </Grid>
    </div>
    );

};

export default VotePage;