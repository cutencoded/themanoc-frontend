import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { create, list, update } from './../translation/translation-api';
import auth from './../auth/auth-helper'


const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 800,
        margin: 'auto',
        textAlign: 'center',
        marginTop: theme.spacing(5),
        // borderTop: '1px solid #d0d0d0',
        marginBottom: theme.spacing(5)
    },
    title: {
        padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
        color: theme.palette.openTitle
    },
    media: {
        minHeight: 200
    },
    error: {
        verticalAlign: 'middle'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 400,
        margin: 'auto',
        paddingBottom: theme.spacing(1)
    },
    submit: {
        margin: 'auto',
        marginBottom: theme.spacing(2)
    },
    list: {
        textAlign: 'center',
        margin: 'auto',
        marginLeft: theme.spacing(21),
        marginRight: theme.spacing(1)
    }
}));

const optimizeTranslations = (translations) => {
    let optimizedTranslations = {};
    translations.map((translation) => {
        optimizedTranslations = { ...optimizedTranslations, [translation.ndebele]: translation.english };
    });

    return optimizedTranslations;
};

const findExistingTranslations = (translationData, values) => translationData.filter((translation) => translation.english == values.english &&
    translation.ndebele == values.ndebele);

const camelizeFirstChar = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);

function Home() {
    const classes = useStyles();

    const jwt = auth.isAuthenticated();

    const [translations, setTranslations] = useState({});

    const [translationData, setTranslationData] = useState([]);

    const [synonyms, setSynonyms] = useState([]);

    const [values, setValues] = useState({
        ndebele: '',
        english: '',
        translator: '',
        dialogTitle: '',
        dialogText: '',
        redirectToSignin: false,
        open: false,
        error: ''
    });

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        list(signal).then((data) => {
            // data = []

            if (data.error) {
                console.log(data.error);
            } else {
                setTranslationData(data)
                setTranslations(optimizeTranslations(data))
            }
        });

        return function cleanup() {
            abortController.abort();
        }
    }, []);

    const clickSubmit = () => {
        const existingTranslations = findExistingTranslations(translationData, values);
        console.log('existing translations: ', existingTranslations);

        if (existingTranslations.length === 0) {
            const translation = {
                translatedBy: jwt.user._id,
                english: values.english.toLowerCase(),
                ndebele: values.ndebele.toLowerCase()
            };

            console.log('Svaing translation: ', translation)
            create({ userId: jwt.user._id }, { t: jwt.token }, translation).then((data) => {
                if (data.error) {
                    setValues({ ...values, error: data.error });
                }

                else {
                    console.log('Created translation from server: ', data)
                    setValues({
                        ...values,
                        dialogTitle: 'Translation Saved',
                        dialogText: 'New transaltion saved successfully',
                        open: true
                    });

                    setTranslations({ ...translations, [values.ndebele]: values.english });
                    setTranslationData([...translationData, data]);
                    // todo: update values with translator and synonyms
                    // reuse code from handle change
                }
            });
        }

        else {
            setValues({ ...values, error: 'Translation already exists' });
        }
    };

    const handleChange = name => event => {
        if (name === 'ndebele') {
            if (Object.keys(translations).includes(event.target.value)) {
                const translationDetails = translationData.filter((translation) => (translation.ndebele == event.target.value) &&
                    (translation.english == translations[event.target.value]));

                const translator = translationDetails[0].translatedBy.name;

                const translationSynonyms = translationData.filter((translation) => (translation.ndebele != event.target.value) &&
                    (translation.english == translations[event.target.value])).map((synonym) => synonym.ndebele);
                setSynonyms(translationSynonyms)
                
                setValues({
                    ...values,
                    translator,
                    [name]: event.target.value,
                    english: translations[event.target.value]
                });

            } else {
                setValues({ ndebele: event.target.value, english: '' });
                setSynonyms([]);
            }
        }

        else {
            setValues({ ...values, [name]: event.target.value });
        }
    }

    const handleRequestClose = (event) => {
        setValues({ ...values, open: false, english: '', ndebele: '' });
    }

    const signin = () => {
        setValues({ ...values, redirectToSignin: true });
    }

    if (values.redirectToSignin) {
        return <Redirect to='/signin' />;
    }

    const enterKey = cb => event => {
        if (event.keyCode == 13) {
            event.preventDefault()
            cb()
        }
    }

    return (<div>
        <Card className={classes.card}>
            <Typography variant="h6" className={classes.title}>
                isiNdebele-to-English Translator
            </Typography>
            <CardContent>
                <br />
                <TextField
                    id="ndebele"
                    spellCheck='false'
                    label="isiNdebele"
                    className={classes.textField}
                    value={values.ndebele}
                    onChange={handleChange('ndebele')}
                    margin="normal"
                />
                <br />
                <TextField
                    id="english"
                    label={'English'}
                    className={classes.textField}
                    value={values.english}
                    onChange={handleChange('english')}
                    margin="normal"
                    onKeyDown={enterKey(clickSubmit)}
                />
                <br /> {
                    values.error && (<Typography component="p">{values.error}</Typography>)
                } <br />
                <List className={classes.list}>
                    {synonyms.length > 0 && (
                        <ListItem>
                            <ListItemText primary={'Synonyms'} secondary={synonyms.map((synonym) => camelizeFirstChar(synonym)).join(', ')} />
                        </ListItem>)
                    }
                    {values.translator &&
                        (<ListItem>
                            <ListItemText primary={'Translated by'} secondary={values.translator} />
                        </ListItem>)
                    }
                </List>
            </CardContent>
            <CardActions>
                {
                    auth.isAuthenticated()
                        ? (<Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>Submit Translation</Button>)
                        : (<Button color="primary" variant="contained" onClick={signin} className={classes.submit}>Sign in to translate</Button>)
                }
            </CardActions>
        </Card>
        <Dialog open={values.open} disableBackdropClick={false} onKeyDown={enterKey(handleRequestClose)}>
            <DialogTitle>{values.dialogTitle}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {values.dialogText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleRequestClose}>Ok</Button>
            </DialogActions>
        </Dialog>
    </div>
    )
};

export default Home;
