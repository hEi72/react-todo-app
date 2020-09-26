import React, { useState } from 'react';
import './Todo.css';
import { ListItem, ListItemIcon, ListItemText, Checkbox, ListItemSecondaryAction, IconButton, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import db from './firebase';
import firebase from 'firebase';

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute', 
        width: 400, 
        backgroundColor: theme.palette.background.paper, 
        border: '2px solid #000', 
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2,4,3)
    },
    list_icon_text: {
        display: 'flex',
    },
}));

function Todo(props) {
    const classes = useStyles();

    // *** Declare var *** //
    props = props.todo;
    const itemId = props.id;
    const labelId = `item-${itemId}`;
    const itemText = props.text;
    const itemTimestamp = props.timestamp_modified;
    var itemDate = '';
    var itemTime = '';
    if (itemTimestamp != null) { // prevent error before data sent to server and return a server time
        const t = new Date(itemTimestamp.seconds *1000);
        const yyyy = t.getFullYear();
        const m = t.getMonth();
        const d = t.getDate();
        var hh = t.getHours();
        var mm = t.getMinutes();
        var ss = t.getSeconds();

        hh = (hh.toString().length < 2) ? `0${hh}` : hh;
        mm = (mm.toString().length < 2) ? `0${mm}` : mm;
        ss = (ss.toString().length < 2) ? `0${ss}` : ss;
        itemDate = `${yyyy}/${m}/${d}`;
        itemTime = `${hh}:${mm}:${ss}`;
    }

    // *** State & Function - Checkbox *** //
    const [checked, setChecked] = React.useState([0]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    // *** State & Function - Dialog box open & close *** //
    const [open, setOpen] = React.useState(false);
    
    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    // *** State & Function - Edit item *** //
    const [update, setUpdate] = useState(itemText); // display properly while typing

    const editItem = (event) => {
        event.preventDefault(); // stop refresh

        db.collection('todos').doc(itemId).update({
            text: update,
            timestamp_modified: firebase.firestore.FieldValue.serverTimestamp() // update last modified date
        });

        handleClose();
    }
    
    // *** Output component *** //
    return (
        <ListItem key={itemText} role={undefined} dense button>
            <div className={classes.list_icon_text} onClick={handleToggle(itemText)}>
            <ListItemIcon>
            <Checkbox edge="start" tabIndex={-1} disableRipple checked={checked.indexOf(itemText) !== -1} inputProps={{ 'aria-labelledby': labelId }} />
            </ListItemIcon>

            <ListItemText id={labelId} primary={itemText} secondary={`${itemDate} ${itemTime}`} />
            </div>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth="sm">
                <DialogTitle id="form-dialog-title">Edit</DialogTitle>
                <form>
                <DialogContent>
                    <TextField autoFocus margin="dense" id="itemContent" label="New content" fullWidth value={update} onChange={event => setUpdate(event.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="default">Cancel</Button>
                    <Button onClick={editItem} color="default" type="submit">Confirm</Button>
                </DialogActions>
                </form>
            </Dialog>

            <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="edit" onClick={handleClickOpen} disableRipple>
                <EditIcon />
            </IconButton>

            <IconButton edge="end" aria-label="edit" onClick={event => db.collection('todos').doc(itemId).delete()} disableRipple>
                <DeleteIcon />
            </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
}

export default Todo
