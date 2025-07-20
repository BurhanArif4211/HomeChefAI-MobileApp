// src/components/RecipeModal.jsx
import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

export function RecipeModal({
  open,
  onClose,
  recipe,
  onToggleFav,
  favLoading,
  showFavoriteButton = false,
  showSource = false,
}) {
  if (!recipe) return null;

  return (
    <Modal open={open} onClose={onClose} title={recipe.title}>
      {/* Description */}
      {recipe.description && (
        <p className="text-sm text-gray-400 mb-4">
          {recipe.description}
        </p>
      )}

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div><strong>Category:</strong> {recipe.category}</div>
        <div><strong>Servings:</strong> {recipe.servings}</div>
        <div><strong>Prep:</strong> {recipe.prepTime} min</div>
        <div><strong>Cook:</strong> {recipe.cookTime} min</div>
        <div><strong>Total:</strong> {recipe.totalTime} min</div>
        {showSource && (
          <div><strong>Source:</strong> {recipe.source}</div>
        )}
      </div>

      {/* Ingredients */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Ingredients</h4>
        <ul className="max-h-48 overflow-auto list-disc list-inside space-y-1">
          {recipe.ingredients.map(i => (
            <li
              key={i.order}
              className="flex justify-between"
            >
              <span className="">{i.name}</span>
              <span className="truncate ml-2 max-w-[40vw] text-gray-400">{i.amount}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Favorite / Actions */}
      {showFavoriteButton && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            ❤️ {recipe.favorites || 0}
          </span>
          <Button
            onClick={onToggleFav}
            disabled={favLoading}
          >
            {favLoading
              ? '…'
              : (recipe.isFav
                  ? 'Remove Favorite'
                  : 'Add to Favorites')}
          </Button>
        </div>
      )}
    </Modal>
  );
}
