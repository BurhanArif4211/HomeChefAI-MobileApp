import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import {backEndBaseURL} from '../config.js';
import { BeatLoader } from 'react-spinners'

export default function ProfileForm({ initial = {}, onSubmit, submitLabel }) {

  const [fullName, setFullName] = useState(initial.fullName || '');
  const [city,    setCity]     = useState(initial.city || '');
  const [gender,  setGender]   = useState(initial.gender || '');
  const [errors, setErrors]    = useState({});
  const [message, setMessage]  = useState('');
  const [loading, setLoading]  = useState(false);

  const validate = () => {
    const errs = {};
    if (!fullName) errs.fullName = 'Required';
    if (!city) errs.city = 'Required';
    if (!gender) errs.gender = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${backEndBaseURL}/api/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, city, gender }),
      });
      const data = await res.json();
      if (res.ok) {
        onSubmit(data.result);     
      } else {
        setMessage(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 p-4">
      <Card className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold">{submitLabel}</h2>
          <Input label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} error={errors.fullName} />
          <Input label="City"      value={city}    onChange={e => setCity(e.target.value)}      error={errors.city} />
          <Input label="Gender"    value={gender}  onChange={e => setGender(e.target.value)}    error={errors.gender} />
          {message && <p className="text-red-400">{message}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <BeatLoader color="#ffffff" loading={loading} size={25}></BeatLoader> : submitLabel}
          </Button>
        </form>
      </Card>
    </div>
  );
}
