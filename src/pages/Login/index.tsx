import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { loggedIn, resetAuth, verifedLogin } from "../../store/app/actions";
import BetroApiObject from "../../api/context";
import Button from "../../ui/Button";
import TextField from "../../ui/TextField";

const App: React.FC<any> = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        BetroApiObject.auth
            .login(email, password)
            .then((payload) => {
                dispatch(loggedIn());
                BetroApiObject.keys
                    .fetchKeys()
                    .then(async (resp) => {
                        BetroApiObject.auth.storeLocal();
                        setLoading(false);
                        if (resp === true) {
                            dispatch(verifedLogin());
                            navigate("/home");
                        } else {
                            dispatch(resetAuth());
                            navigate("/login");
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
            <div className={"shadow-2xl flex flex-col mt-12 max-w-xl p-16 mx-auto"}>
                <div>
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <div className="my-2 mx-auto text-center">
                            <div className="text-2xl text-gray-700">Welcome to Betro App.</div>
                            <div className="text-xl text-gray-500">Please login below</div>
                        </div>
                        <div className="my-2 mx-auto text-center">
                            <TextField
                                type="email"
                                disabled={loading}
                                placeholder="Email"
                                error={email.length === 0 || !email.includes("@")}
                                name="email"
                                required
                                value={email}
                                onChange={setEmail}
                            />
                        </div>
                        <div className="my-2 mx-auto text-center">
                            <TextField
                                type="password"
                                disabled={loading}
                                name="password"
                                error={password.length === 0}
                                required
                                placeholder="Password"
                                value={password}
                                onChange={setPassword}
                            />
                        </div>
                        {error != null && (
                            <div className="my-2 mx-auto text-center">
                                <div className="my-2 text-sm text-gray-500">{error}</div>
                            </div>
                        )}
                        <div className="my-2 mx-auto text-center">
                            <Button aria-label="Login" disabled={loading} type="submit">
                                Login
                            </Button>
                        </div>
                        <div className="my-2 mx-auto text-center">
                            <Link to="/register">Register</Link>
                        </div>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
};

export default App;
