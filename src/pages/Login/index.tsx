import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import { loggedIn, resetAuth, verifedLogin } from "../../store/app/actions";
import classes from "./Login.module.scss";
import BetroApiObject from "../../api/context";
import Button from "../../components/Button";

const App: React.FC<any> = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        BetroApiObject.auth
            .login(email, password)
            .then((payload) => {
                dispatch(loggedIn());
                BetroApiObject.account
                    .fetchKeys()
                    .then(async (resp) => {
                        setLoading(false);
                        if (resp === true) {
                            dispatch(verifedLogin());
                            const state = location.state || { from: { pathname: "/home" } };
                            history.replace((state as any).from);
                        } else {
                            const state = { from: { pathname: "/login" } };
                            dispatch(resetAuth());
                            history.replace((state as any).from);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        const errorMessage = error.response?.data?.data || "Login error";
                        setLoading(false);
                        setError(errorMessage);
                    });
            })
            .catch((error) => {
                console.log(error);
                const errorMessage = error.response?.data?.data || "Login error";
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
                            <Typography variant="h5">Please login below</Typography>
                        </div>
                        <div className={classes.formComponent}>
                            <TextField
                                type="email"
                                disabled={loading}
                                label="Email"
                                error={email.length === 0 || !email.includes("@")}
                                name="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                        {error != null && (
                            <div className={classes.formComponent}>
                                <FormHelperText>{error}</FormHelperText>
                            </div>
                        )}
                        <div className={classes.formComponent}>
                            <Button disabled={loading} type="submit">
                                Login
                            </Button>
                        </div>
                        <div className={classes.formComponent}>
                            <Link to="/register">Register</Link>
                        </div>
                    </form>
                </FormControl>
            </Paper>
        </React.Fragment>
    );
};

export default App;
