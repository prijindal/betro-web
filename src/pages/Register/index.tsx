import React, { useCallback, useState } from "react";
import isEmpty from "lodash/isEmpty";
import throttle from "lodash/throttle";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { loggedIn } from "../../store/app/actions";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckIcon from "@material-ui/icons/Check";
import ErrorIcon from "@material-ui/icons/Error";
import classes from "../Login/Login.module.scss";
import BetroApiObject from "../../api/context";
import Button from "../../components/Button";

const UsernameField: React.FunctionComponent<{
    value: string;
    onChange: (value: string) => void;
    errorMessage: string;
    label: string;
    placeholder: string;
    name: string;
    type: "text" | "email";
    checkFunction: (a: string) => Promise<boolean>;
}> = (props) => {
    const { value, onChange, errorMessage, placeholder, label, type, name, checkFunction } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldvalue, setFieldvalue] = useState<string>(value);
    const handleFieldChange = (username: string) => {
        checkFunction(username)
            .then((data) => {
                setLoading(false);
                if (data === false) {
                    setError(errorMessage);
                } else {
                    onChange(username);
                    setError(null);
                }
            })
            .catch((error) => {
                setLoading(false);
                const message = error.response?.data?.data || errorMessage;
                setError(message);
            });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleFieldChangeThrottle = useCallback(throttle(handleFieldChange, 2000), []);
    const isErrored = fieldvalue.length === 0 || error != null;
    return (
        <TextField
            type={type}
            label={error || label}
            error={isErrored}
            name={name}
            placeholder={placeholder}
            required
            value={fieldvalue}
            onChange={(e) => {
                setLoading(true);
                setFieldvalue(e.target.value);
                handleFieldChangeThrottle(e.target.value);
            }}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        {isErrored ? (
                            <ErrorIcon />
                        ) : loading ? (
                            <CircularProgress size={20} />
                        ) : (
                            <CheckIcon />
                        )}
                    </InputAdornment>
                ),
            }}
        />
    );
};

const App: React.FC<any> = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const history = useHistory();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEmpty(password) || password !== confirmPassword) {
            return;
        }
        setLoading(true);
        BetroApiObject.auth
            .register(username, email, password)
            .then((payload) => {
                setLoading(false);
                history.push("/");
                if (payload) {
                    dispatch(loggedIn());
                }
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.data || "Registration error";
                setLoading(false);
                setError(errorMessage);
            });
    };
    return (
        <React.Fragment>
            <Paper className={classes.paper} elevation={3}>
                <FormControl className={classes.paper}>
                    <form onSubmit={handleSubmit} className={classes.formWrapper}>
                        <div className={classes.formComponent} style={{ marginBottom: "20px" }}>
                            <Typography variant="h4">Welcome to Betro App.</Typography>
                            <Typography variant="h5">Please register below</Typography>
                        </div>
                        <div className={classes.formComponent}>
                            <UsernameField
                                value={username}
                                onChange={setUsername}
                                errorMessage="Username is not available"
                                checkFunction={BetroApiObject.auth.isAvailableUsername}
                                name="username"
                                label="Username"
                                placeholder="Username"
                                type="text"
                            />
                        </div>
                        <div className={classes.formComponent}>
                            <UsernameField
                                value={email}
                                onChange={setEmail}
                                errorMessage="Email is not available"
                                checkFunction={BetroApiObject.auth.isAvailableEmail}
                                name="email"
                                label="Email"
                                placeholder="Email"
                                type="email"
                            />
                        </div>
                        <div className={classes.formComponent}>
                            <TextField
                                type="password"
                                disabled={loading}
                                name="password"
                                label="Password"
                                error={password.length === 0}
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className={classes.formComponent}>
                            <TextField
                                type="password"
                                disabled={loading}
                                name="confirm_password"
                                label="Confirm Password"
                                error={confirmPassword.length === 0}
                                required
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        {error != null && (
                            <div className={classes.formComponent}>
                                <FormHelperText>{error}</FormHelperText>
                            </div>
                        )}
                        <div className={classes.formComponent}>
                            <Button disabled={loading} type="submit">
                                Register
                            </Button>
                        </div>
                        <div className={classes.formComponent}>
                            <Link to="/login">Login</Link>
                        </div>
                    </form>
                </FormControl>
            </Paper>
        </React.Fragment>
    );
};

export default App;
