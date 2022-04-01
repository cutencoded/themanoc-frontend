import React, {useState} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import {create} from './api-user.js'
import {Link} from 'react-router-dom'
import Snackbar from '@material-ui/core/Snackbar';


const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 600,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing(5),
        paddingBottom: theme.spacing(2)
    },
    error: {
        verticalAlign: 'middle'
    },
    title: {
        marginTop: theme.spacing(2),
        color: theme.palette.openTitle
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing(2)
    }
}))

export default function Signup (){
    const classes = useStyles();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: ''
    });

    const [values, setValues] = useState({
        studentId: '',
        firstName: '',
        lastName: '',
        dob: '',
        email: '',
        phoneNumber: '',
        guardianName: '',
        guardianPhoneNumber: '',
        guardianAddress: ''
    })

    const handleChange = name => event => {
        setValues({ ...values, [name]: event.target.value })
    }

    const clickSubmit = () => {
        const student = {
            student_id: values.studentId || undefined,
            first_name: values.firstName || undefined,
            last_name: values.lastName || undefined,
            date_of_birth: values.dob || undefined,
            student_email: values.email || undefined,
            phone_number: values.phoneNumber || undefined,
            parent_or_guardian: {
                guardian_name: values.guardianName || undefined,
                phone_number: values.guardianPhoneNumber || undefined,
                address: values.guardianAddress || undefined
            }
        };

        create(student).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error})
            } else {
                setValues({ ...values, error: '' });
                setSnackbar({
                    ...snackbar,
                    open: true,
                    message: 'Student details saved successfully'
                });
            }
        });
    };

    const handleRequestClose = (event, reason) => {
        setSnackbar({...snackbar, open: false })
    }

    return (<div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Themanoc Student Details
          </Typography>
          <TextField id="natid" label="Student National ID" className={classes.textField} value={values.studentId} onChange={handleChange('studentId')} margin="normal"/><br/>
          <TextField id="name" label="First Name" className={classes.textField} value={values.firstName} onChange={handleChange('firstName')} margin="normal"/><br/>
          <TextField id="name" label="Last Name" className={classes.textField} value={values.lastName} onChange={handleChange('lastName')} margin="normal"/><br/>
          <TextField id="name" label="Date of Birth" className={classes.textField} value={values.dob} onChange={handleChange('dob')} margin="normal"/><br/>
          <TextField id="email" type="email" label="Email" className={classes.textField} value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
          <TextField id="phonenumber" type="phone" label="Phone Number" className={classes.textField} value={values.phoneNumber} onChange={handleChange('phoneNumber')} margin="normal"/><br/>
          <TextField id="name" label="Guardian Name" className={classes.textField} value={values.guardianName} onChange={handleChange('guardianName')} margin="normal"/><br/>
          <TextField id="phonenumber" type="phone" label="Guardian Phone Number" className={classes.textField} value={values.guardianPhoneNumber} onChange={handleChange('guardianPhoneNumber')} margin="normal"/><br/>
          <TextField id="name" label="Guardian Address" className={classes.textField} value={values.guardianAddress} onChange={handleChange('guardianAddress')} margin="normal"/><br/>
          <br/> {
            values.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {values.error}</Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>
      </Card>
      <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={snackbar.open}
            onClose={handleRequestClose}
            autoHideDuration={2000}
            message={<span className={classes.snack}>{snackbar.message}</span>}
        />
    </div>)
}