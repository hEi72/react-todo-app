import React from 'react';
import './Todo.css';
import { ListItem, ListItemIcon, ListItemText, Checkbox, ListItemSecondaryAction, IconButton, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import db from './firebase';
import firebase from './firebase';

function Todo(props) {
    // *** Declare var *** //
    props = props.todo;
    const itemId = props.id;
    const labelId = `item-${itemId}`;
    const itemText = props.text;
    const itemTimestamp = props.timestamp;
    var itemDate = '';
    var itemTime = '';
    if (itemTimestamp != null) {
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

    // *** Function - Edit item *** //
    const editItem = (event) => {
        db.collection('todos').doc(itemId).update({
            text: '',
            timestamp: firebase.firestore.FieldValue.serverTimestamp() // update last modified date
        })
    }
    
    // *** Output component *** //
    return (
        <ListItem key={itemText} role={undefined} dense button onClick={handleToggle(itemText)}>
            <ListItemIcon>
            <Checkbox edge="start" tabIndex={-1} disableRipple
                checked={checked.indexOf(itemText) !== -1}
                inputProps={{ 'aria-labelledby': labelId }}
            />
            </ListItemIcon>

            <ListItemText id={labelId} primary={itemText} secondary={`${itemDate} ${itemTime}`} />

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth="sm">
                <DialogTitle id="form-dialog-title">Edit</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" id="itemContent" label="New content" fullWidth value={"update"}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={editItem} color="primary">Confirm</Button>
                </DialogActions>
            </Dialog>

            <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="edit" onClick={handleClickOpen}>
                <EditIcon />
            </IconButton>

            <IconButton edge="end" aria-label="edit" onClick={event => db.collection('todos').doc(itemId).delete()}>
                <DeleteIcon />
            </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
}

export default Todo
