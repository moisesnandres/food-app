import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import api from '../api';
import './Meals.css';

const Meals = () => {
  const { category } = useParams();
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await api.get('/meals', {
          params: { category },
        });
        setMeals(response.data);
        setFilteredMeals(response.data);
      } catch (error) {
        console.error('Error fetching meals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [category]);

  const applyFilters = (query, sortOption) => {
    const lowerCaseQuery = query.toLowerCase();
    let updatedMeals = meals.filter((meal) =>
      meal.name.toLowerCase().includes(lowerCaseQuery)
    );

    switch (sortOption) {
      case 'price-asc':
        updatedMeals.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        updatedMeals.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        updatedMeals.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        updatedMeals.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredMeals(updatedMeals);
  };

  const handleSearch = useMemo(
    () =>
      debounce((query) => {
        applyFilters(query, sortOption);
      }, 300),
    [meals, sortOption]
  );

  const onSearchChange = (event) => {
    const query = event.target.value;
    setSearch(query);
    handleSearch(query);
  };

  const onSortChange = (option) => {
    setSortOption(option);
    applyFilters(search, option);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="star-icon" />);
    }

    if (halfStar) {
      stars.push(
        <FontAwesomeIcon
          key="half-star"
          icon={faStarHalfAlt}
          className="star-icon"
        />
      );
    }

    return stars;
  };

  if (loading) {
    return <p>Loading meals...</p>;
  }

  return (
    <div>
      <h1>Meals for {category}</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search meals..."
          value={search}
          onChange={onSearchChange}
          className="search-input"
        />
      </div>

      <div className="sort-container">
        <label htmlFor="sort">Sort By: </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
          className="sort-select"
        >
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Rating</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      <div className="meals-container">
        {filteredMeals.map((meal) => (
          <div key={meal.id} className="meal-card">
            <img src={meal.image_url} alt={meal.name} className="meal-image" />
            <h2 className="meal-name">{meal.name}</h2>
            <p className="meal-price">
              ${meal.price ? Number(meal.price).toFixed(2) : '0.00'}
            </p>
            <div className="meal-rating">
              {renderStars(meal.rating || 0)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meals;
