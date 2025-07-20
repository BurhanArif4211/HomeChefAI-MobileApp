// src/components/CustomRecipeForm.jsx
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button.jsx';
import { ListEditor } from './ui/ListEditor';
import {backEndBaseURL} from './../config.js';

export default function CustomRecipeForm({ userId, onAdded }) {
  const [recipe, setRecipe] = useState({
    title: '', description: '', ingredients: [],
    prepTime: '', cookTime: '', totalTime: '', servings: '', category: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Simple validation
  const validate = () => {
    const e = {};
    if (!recipe.title.trim()) e.title = 'Required';
    // you can add more...
    setErrors(e);
    return !Object.keys(e).length;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients.map((ing, idx) => ({
          amount: ing.amount, name: ing.name, order: idx
        })),
        prepTime: Number(recipe.prepTime) || 0,
        cookTime: Number(recipe.cookTime) || 0,
        totalTime: Number(recipe.totalTime) || 0,
        servings: Number(recipe.servings) || 0,
        category: recipe.category,
        source: 'User-Generated',
        createdBy: userId,
      };
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${backEndBaseURL}/api/custom-recipes/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onAdded(data.recipe);
        setRecipe({ title:'', description:'', ingredients:[], prepTime:'', cookTime:'', totalTime:'', servings:'', category:'' });
        setMsg('Added!');
      } else {
        setMsg(data.message || 'Failed');
      }
    } catch (err) {
      console.error(err);
      setMsg('Network error');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(''), 2000);
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-semibold">Add Custom Recipe</h3>
        <Input
          label="Title" value={recipe.title}
          onChange={e => setRecipe(r => ({...r, title: e.target.value}))}
          error={errors.title}
        />
        <Input
          label="Description" value={recipe.description}
          onChange={e => setRecipe(r => ({...r, description: e.target.value}))}
          placeholder="Long method..."
        />
        <ListEditor
          items={recipe.ingredients.map(i => `${i.amount}|${i.name}`)}
          onChange={arr => {
            const parsed = arr.map(str => {
              const [amount, name] = str.split('|');
              return { amount: amount||'', name: name||'', order:0 };
            });
            setRecipe(r => ({...r, ingredients: parsed}));
          }}
          placeholder="amount|ingredient (e.g. “2 cups|flour”)"
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            label="Prep Time" type="number"
            value={recipe.prepTime}
            onChange={e => setRecipe(r=>({...r,prepTime:e.target.value}))}
          />
          <Input
            label="Cook Time" type="number"
            value={recipe.cookTime}
            onChange={e => setRecipe(r=>({...r,cookTime:e.target.value}))}
          />
          <Input
            label="Total Time" type="number"
            value={recipe.totalTime}
            onChange={e => setRecipe(r=>({...r,totalTime:e.target.value}))}
          />
          <Input
            label="Servings" type="number"
            value={recipe.servings}
            onChange={e => setRecipe(r=>({...r,servings:e.target.value}))}
          />
        </div>
        <Input
          label="Category"
          value={recipe.category}
          onChange={e => setRecipe(r=>({...r,category:e.target.value}))}
        />
        {msg && <p className="text-green-400">{msg}</p>}
        <div className="text-right">
          <Button type="submit" disabled={loading}>
            {loading ? 'Adding…' : 'Add Recipe'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
