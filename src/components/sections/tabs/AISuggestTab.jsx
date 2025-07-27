// src/components/AISuggestTab.jsx
import React, { useState, useEffect } from 'react';
import { Card } from './../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from './../../ui/Input';
import { ListEditor } from './../../ui/ListEditor';
import { Switch } from './../../ui/switch'
import { BeatLoader } from 'react-spinners';
import { backEndBaseURL } from './../../../config';
import { LucideStars } from 'lucide-react'
import { cn } from './../../../lib/utils'
export default function AISuggestTab({ user, customRecipes, setCustomRecipes }) {
  const [ingredients, setIngredients] = useState([]);
  const [listKey, setListKey] = useState(0);
  const [context, setContext] = useState('');
  const [templateIndex, setTemplateIndex] = useState('');
  const [strict, setStrict] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setIngredients([]);
    setListKey(k => k + 1);
  }, [user.groceryList]);

  const loadGrocery = () => {
    setIngredients([...user.groceryList]);
    setListKey(k => k + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const token = localStorage.getItem('authToken');
      const payload = { ingredients, context, templateIndex: Number(templateIndex), strict };
      const res = await fetch(`${backEndBaseURL}/api/ai/suggestSuitableRecipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.recipe && data.recipe.title) {
          setResult(data);
        } else if (!data.recipe.success) {
          setMessage(data.message || 'No Recipe Could be generated');
        }
      } else {
        setMessage(data.message || 'No recipe returned');
      }
    } catch (err) {
      console.error(err);
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result.recipe.title) {
      setMessage("Recipe was not Generated")
      return;
    }
    setSaveLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${backEndBaseURL}/api/ai/saveGeneratedRecipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ logId: result.logId }),
      });
      const data = await res.json();
      if (data.success) {
        // Update custom recipes in state
        fetchAndUpdateCustomRecipes();
      }
      setMessage(data.success ? 'Saved!' : data.message || 'Save failed');
    } catch (err) {
      console.error(err);
      setMessage('Network error');
    } finally {
      setSaveLoading(false);
      setTimeout(() => setMessage(''), 2000);
    }
  };
  async function fetchAndUpdateCustomRecipes() {
    const token = localStorage.getItem('authToken');
    const res = await fetch(`${backEndBaseURL}/api/custom-recipes/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      let recipesData = await res.json();
      if (recipesData.success) {
        setCustomRecipes(recipesData.recipes);
      } else {
        console.error('Failed to fetch custom recipes:', recipesData.message);
      }
    };

    return res.json();
  }
  return (
    <div className="p-4 space-y-6 overflow-x-hidden">
      {/* Form */}
      <Card className="bg-slate-800 text-white relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-4xl leading-[3.5rem] font-black bg-gradient-to-tr from-purple-700 to-pink-500 bg-clip-text text-transparent">
            AI Suggestion
          </h3>
          <div className="grid  gap-2">
            <Button className="py-1" type="button" variant="outline" size="sm" onClick={loadGrocery}>
              Load My Groceries
            </Button>
          </div>
          <span className="text-sm text-slate-300 mb-0.5">Enter ingredients available</span>
          <ListEditor
            key={listKey}
            items={ingredients}
            onChange={setIngredients}
            placeholder="Add up to 15 ingredients..."
          />
          <Input
            label="Context (optional)"
            value={context}
            onChange={e => setContext(e.target.value)}
            placeholder="Add Additional Instructions"
          />
          <div className="flex items-center">
            <label className="flex items-center space-x-2">
              <Switch
                checked={strict}
                onChange={setStrict}
              />
              <span className="text-lg">Strictly Use Ingredients</span>
            </label>
          </div>
          <div className="grid gap-2">
            <div>
              <select
                className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white"
                value={templateIndex}
                onChange={e => setTemplateIndex(Number(e.target.value))}
              >
                <option value="">Default Template</option>
                <option value="1">Detailed Recipe</option>
                <option value="2">Quick Efficient</option>
                <option value="3">Unique</option>
              </select>
            </div>
            <div className="text-right">
              <Button className="bg-gradient-to-tr from-purple-700 to-pink-500" type="submit" variant="AI" disabled={loading}>
                <LucideStars
                  className={cn(
                    'w-6 h-6 mr-1',
                    loading ? 'text-purple-500' : 'text-white'
                  )}
                >
                </LucideStars>
                {loading
                  ? <BeatLoader size={8} color="#fff" />
                  : 'Get Suggestion'}
              </Button>
            </div>
          </div>


        </form>
        {/* This is for marching border */}

        {loading ? <div className="pointer-events-none select-none absolute inset-0 border-4 border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
          <div className="absolute w-80 animate-march aspect-square bg-gradient-to-tr from-purple-700 to-pink-400" style={{ offsetDistance: "0%", offsetPath: "rect(-20px auto auto -20px round 320px)", overflow: "hidden" }}></div>
        </div> : ""}
      </Card>

      {/* Message */}
      {message && <p className="text-center text-red-400">{message}</p>}

      {/* Result */}

      {result && (
        <Card className="space-y-4 bg-gray-800 text-white">
          <h3 className="text-2xl font-bold">{result.recipe.title}</h3>
          <p className="text-sm text-gray-300 max-h-50 overflow-scroll">{result.recipe.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <p><strong>Prep:</strong> {result.recipe.prepTime} min</p>
            <p><strong>Cook:</strong> {result.recipe.cookTime} min</p>
            <p><strong>Total:</strong> {result.recipe.totalTime} min</p>
            <p><strong>Servings:</strong> {result.recipe.servings}</p>
          </div>

          {/* Ingredients */}
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Ingredients</h4>
            <ul className="max-h-48 overflow-auto list-disc list-inside space-y-1">
              {result.recipe.ingredients.map(i => (
                <li
                  key={i.order}
                  className="flex justify-between"
                >
                  <span className="">{i.name}</span>
                  <span className="truncate ml-2 max-w-[60vw] text-gray-400">{i.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-right space-x-2">
            <Button onClick={handleSave} disabled={saveLoading}>
              {saveLoading ? <BeatLoader size={8} color="#fff" /> : 'Save Recipe'}
            </Button>
          </div>
        </Card>

      )}
    </div>
  );
}
