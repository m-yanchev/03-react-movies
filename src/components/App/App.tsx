import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import css from './App.module.css';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import SearchBar from '../SearchBar/SearchBar';
import fetchMovies from '../../services/movieService';
import type { Movie } from '../../types/movie';

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const closeModal = () => setSelectedMovieId(null);

  const handleSubmit = async (query: string) => {
    try {
      setIsError(false);
      setIsLoading(true);

      const movies = await fetchMovies(query);
      if (movies.length === 0) {
        toast.error('No movies found for your request.');
      }
      setMovies(movies);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (id: number) => {
    setSelectedMovieId(id);
  };

  const selectedMovie =
    selectedMovieId !== null ? movies.find((movie) => movie.id === selectedMovieId) : null;
  const isMovies = movies.length > 0;

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit} />
      <Toaster />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isMovies && !isError && !isLoading && <MovieGrid movies={movies} onSelect={handleSelect} />}
      {selectedMovie && <MovieModal onClose={closeModal} movie={selectedMovie} />}
    </div>
  );
}
