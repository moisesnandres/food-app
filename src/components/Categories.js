import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <p>Loading categories...</p>;
  }

  return (
    <div className="categories-container">
      {categories.map((category) => (
        <Link
          to={`/meals/${category.name}`}
          key={category.id}
          className="category-card"
          style={{ backgroundImage: `url(${category.image_url})` }}
        >
          <div className="category-name">{category.name}</div>
        </Link>
      ))}
    </div>
  );
};

export default Categories;
