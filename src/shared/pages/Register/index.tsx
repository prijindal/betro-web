import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { loggedIn } from 'store/app/actions';
import { register } from '../../api/login';

const App: React.FC<any> = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const dispatch = useDispatch();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register(email, password).then((payload) => {
            dispatch(loggedIn(payload));
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
                        type="confirm_password"
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
