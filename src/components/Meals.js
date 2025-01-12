import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import './Meals.css';

const Meals = () => {
  const { category } = useParams();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await api.get('/meals', {
          params: { category },
        });
        setMeals(response.data);
      } catch (error) {
        console.error('Error fetching meals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [category]);

  if (loading) {
    return <p>Loading meals...</p>;
  }

  return (
    <div>
      <h1>Meals for {category}</h1>
      <div className="meals-container">
        {meals.map((meal) => (
          <div key={meal.id} className="meal-card">
            <img src={meal.image_url} alt={meal.name} className="meal-image" />
            <h2 className="meal-name">{meal.name}</h2>
            <p className="meal-price">
              ${meal.price ? Number(meal.price).toFixed(2) : '0.00'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meals;
