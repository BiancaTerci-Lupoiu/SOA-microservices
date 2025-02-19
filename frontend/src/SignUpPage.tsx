import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const navigate = useNavigate();

  const handleSubmit = () => {
    fetch('http://localhost/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          response.json().then(() => {
            navigate('/login');
          });
        }
        if (response.status === 401) {
          alert('Incorrect sign up data');
        }
      })
      .catch((error) => {
        console.log(error);
        alert('Invalid data');
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
      <label htmlFor="textInput">Name: </label>
      <input
        type="text"
        id="textInput"
        value={name}
        onChange={handleChangeName}
        placeholder="name"
      />
      <label htmlFor="textInput">Email: </label>
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
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default SignUpPage;
