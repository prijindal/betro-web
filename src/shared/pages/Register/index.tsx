import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { loggedIn } from 'store/app/actions';
import { register } from '../../api/login';

const App: React.FC<any> = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEmpty(password) || password !== confirmPassword) {
            return;
        }
        register(email, password).then((payload) => {
            const state = location.state || { from: { pathname: '/' } };
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
                    <input
                        type="password"
                        name="confirm_password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit">Register</button>
                    <Link to="/login">Login</Link>
                </form>
            </div>
        </React.Fragment>
    );
};

export default App;
