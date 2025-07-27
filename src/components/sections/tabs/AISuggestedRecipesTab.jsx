import React, { useState, useEffect } from 'react';
import { Card } from './../../ui/Card';
import { Button } from '../../ui/Button';
import { RecipeModal } from './../../RecipeModal';
import { backEndBaseURL } from './../../../config';
import { BeatLoader } from 'react-spinners';

export default function AISuggestedRecipesTab({
    customRecipes
}) {
    const [recipes, setRecipes] = useState(customRecipes);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);

    // Sync recipes whenever the prop changes
    useEffect(() => {
        setRecipes(customRecipes);
    }, [customRecipes]);

    if (loading) return (
        <div className="text-center">
            <BeatLoader loading={loading} size={8} color="#fff" />
        </div>
    )
    if (!recipes.length) return <p className="p-4 text-center">No favorites yet.</p>;

    return (
        <div className="space-y-4 p-4">
            {recipes.map(r => (

                (r.source == 'gemini-generated' || r.source == 'ai-generated') ?
                    <Card
                        className="cursor-pointer hover:bg-gray-700 "
                        onClick={() => setSelected(r)}
                        key={r.recipeId}>
                        <h3 className="text-lg font-semibold">{r.title}</h3>
                        <p className="text-sm text-gray-300 max-h-32 overflow-hidden">{r.description}</p>
                    </Card> : ""

            ))}
            <RecipeModal
                open={!!selected}
                onClose={() => setSelected(null)}
                recipe={selected}
                showFavoriteButton={false}
                showSource={true}
            />
        </div>
    );
}