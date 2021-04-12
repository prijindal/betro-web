import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { loggedIn } from 'store/app/actions';
import { login } from '../../api/login';

const App: React.FC<any> = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const state = location.state || { from: { pathname: '/' } };
        login(email, password).then((payload) => {
            dispatch(loggedIn(payload));
            history.replace((state as any).from);
        });
    };
    return (
        <React.Fragment>
            <div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                    <Link to="/register">Register</Link>
                </form>
            </div>
        </React.Fragment>
    );
};

export default App;
