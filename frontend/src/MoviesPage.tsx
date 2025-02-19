import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { Movie } from './Movie.ts';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  useEffect(() => {
    fetch('http://localhost/movies', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => res.json())
      .then((fetchedMovies) => setMovies(fetchedMovies));
  }, []);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleBuyTicket = (movieId: string) => {
    fetch(`http://localhost/tickets/${movieId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            console.log(data);
            alert('Successfully bought ticket!');
          });
        }
        if (response.status === 404) {
          alert('Movie not found!');
        }
      })
      .catch((error) => {
        console.log(error);
        alert('Something went wrong');
      });
  };

  const formatDate = (dateInput: string) => {
    const date = new Date(dateInput);
    // Get components of the date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    // Get components of the time
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Return formatted date and time
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  return (
    <div>
      {!auth.isAuthenticated && 'Please log in before buying tickets'}
      {!auth.isAuthenticated && (
        <>
          <div>You need to be authenticated in order to buy a ticket!</div>
          <br />
          <button onClick={() => navigate('/login')}> Log in </button>
        </>
      )}
      {auth.isAuthenticated &&
        movies.length > 0 &&
        movies.map((movie, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ccc',
              padding: '10px 50px',
              margin: '10px',
              borderRadius: '5px',
            }}
          >
            <h3>{movie.title}</h3>
            <p>
              <strong>Location:</strong> {movie.location}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(movie.date.toString())}
            </p>
            <p>
              <strong>Price per ticket:</strong> ${movie.price}
            </p>
            <button
              onClick={() => handleBuyTicket(movie._id)}
              style={{
                marginLeft: '10px',
                backgroundColor: '#2c1978',
                color: 'white',
              }}
            >
              Buy Ticket
            </button>
          </div>
        ))}
    </div>
  );
};

export default MoviesPage;
