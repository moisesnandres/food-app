import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

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
      <ul>
        {meals.map((meal) => (
          <li key={meal.id}>
            <h2>{meal.name}</h2>
            <p>Price: ${meal.price}</p>
            <img src={meal.image_url} alt={meal.name} width="200" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Meals;
