import { ChangeEvent, useState } from 'react';
import { useAuth } from './AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = () => {
    fetch('http://localhost/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            auth.setToken(data.token);
            auth.setIsAuthenticated(true);
            navigate('/');
          });
        }
        if (response.status === 401) {
          alert('Invalid credentials');
        }
      })
      .catch((error) => {
        console.log(error);
        alert('Invalid credentials');
      });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <label htmlFor="textInput">Email:</label>
      <input
        type="text"
        id="textInput"
        value={email}
        onChange={handleChangeEmail}
        placeholder="email"
      />
      <label htmlFor="textInput">Password: </label>
      <input
        type="password"
        id="textInput"
        value={password}
        onChange={handleChangePassword}
        placeholder="password"
      />
      <button onClick={handleSubmit}>Login</button>
      <div>
        <div>If you don't have an account, please create one</div>
        <button onClick={() => navigate('/signup')}>Sign Up</button>
      </div>
    </div>
  );
};

export default LoginPage;
