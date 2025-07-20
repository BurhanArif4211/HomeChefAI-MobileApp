// src/components/SignupForm.jsx
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { backEndBaseURL } from './../config';
import { BeatLoader } from 'react-spinners';
import { Flag } from 'lucide-react';


export default function SignupForm({ onBack, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email required';
    if (!password) errs.password = 'Password required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  async function handleSubmit(e) {
    setLoading(true)
    e.preventDefault(); if (!validate()) {
      setLoading(false)
      return
    };
    try {
      const res = await fetch(`${backEndBaseURL}/api/auth/signup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Email verification sent. Please verify and login again.');
      }
      else {

        setMsg(data.message);
      }
    } catch {
      // setMsg('Network error');
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 p-4">
      <Button variant="outline" onClick={onBack}>← Back</Button>
      <Card className="mt-6 mx-auto max-w-md">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold">Sign Up</h2>
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} error={errors.password} />
          {msg && <p className="text-red-400 text-center">{msg}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <BeatLoader color="#ffffff" loading={loading} size={25}></BeatLoader> : "Sign Up"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
