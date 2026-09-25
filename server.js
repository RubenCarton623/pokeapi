const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/pokemon', async (req, res) => {
    try {
        const offset = Number(req.query.offset) || 0;
        const limit = Number(req.query.limit) || 20;

        const response = await fetch(
            `${POKEAPI_URL}?offset=${offset}&limit=${limit}`
        );

        if (!response.ok) {
            throw new Error('Error al consultar PokeAPI');
        }

        const data = await response.json();

        // Obtener información detallada de cada Pokémon
        const pokemonDetails = await Promise.all(
            data.results.map(async (pokemon) => {
                const response = await fetch(pokemon.url);
                const detail = await response.json();

                return {
                    id: detail.id,
                    name: detail.name,
                    height: detail.height,
                    weight: detail.weight,
                    image: detail.sprites.other['official-artwork'].front_default,
                    types: detail.types.map(type => type.type.name),
                    abilities: detail.abilities.map(
                        ability => ability.ability.name
                    )
                };
            })
        );

        res.json({
            count: data.count,
            next: data.next,
            previous: data.previous,
            results: pokemonDetails
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: 'No se pudieron obtener los Pokémon'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});