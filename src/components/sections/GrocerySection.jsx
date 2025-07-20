import React, { useState, useEffect } from 'react';
import { Card } from './../ui/Card';
import { Button } from './../ui/Button';
import { ListEditor } from './../ui/ListEditor';
import {backEndBaseURL} from './../../config';

export default function GrocerySection({ user, setUser }) {
  const [list, setList] = useState(user.groceryList || []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Sync if user.groceryList changes elsewhere
  useEffect(() => {
    setList(user.groceryList || []);
  }, [user.groceryList]);

  const saveList = async () => {
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${backEndBaseURL}/api/user/grocery-list`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ groceryList: list })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(prev => ({ ...prev, groceryList: list }));
        setMessage('Saved!');
      } else {
        setMessage(data.message || 'Save failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Network error');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <div className="p-4 flex-1 flex flex-col">
      <Card>
        <h2 className="text-lg font-semibold mb-4">Your Grocery List</h2>
        <ListEditor
          items={list}
          onChange={setList}
          placeholder="e.g. Apples"
        />
        {message && <p className="mt-2 text-sm text-green-400">{message}</p>}
        <div className="mt-4 text-right">
          <Button onClick={saveList} disabled={loading}>
            {loading ? 'Saving…' : 'Save List'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
