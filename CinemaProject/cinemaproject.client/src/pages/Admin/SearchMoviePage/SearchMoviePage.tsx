import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchMoviePage.module.scss';

const SearchMoviePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Імітація результатів пошуку
  const results = [
    { title: 'Minecraft Movie', year: 2025, poster: '/Minecraft.png' },
    { title: 'Minecraft: Story Mode', year: 2015, poster: '/Minecraft.png' },
  ];

  const handleSelect = (movie: any) => {
    navigate('/admin/movies/add', { 
      state: { 
        baseData: {
          title: movie.title,
          posterUrl: movie.poster,
          year: movie.year
        } 
      } 
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Пошук фільму</h1>
      <input 
        className={styles.searchInput}
        placeholder="Введіть назву фільму..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className={styles.resultsGrid}>
        {results.map((movie, idx) => (
          <div key={idx} className={styles.moviePlate} onClick={() => handleSelect(movie)}>
            <img src={movie.poster} alt={movie.title} />
            <div className={styles.plateInfo}>
              <h3>{movie.title}</h3>
              <p>{movie.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchMoviePage;