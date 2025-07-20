import React from 'react';
import ProfileForm from './ProfileForm';

export default function ProfileSetup({ user, onSetupComplete }) {
  return (
    <ProfileForm
      initial={user}
      submitLabel="Complete Profile"
      onSubmit={updatedUser => onSetupComplete(updatedUser)}
    />
  );
}
