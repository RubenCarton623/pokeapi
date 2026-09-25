const pokemonContainer = document.getElementById('pokemon-container');

const previousBtn = document.getElementById('previousBtn');
const nextBtn = document.getElementById('nextBtn');

const pageInfo = document.getElementById('pageInfo');

const LIMIT = 20;

let currentOffset = 0;
let totalPokemon = 0;

async function loadPokemon(offset = 0) {

    try {

        pokemonContainer.innerHTML = '<p>Cargando Pokémon...</p>';

        const response = await fetch(
            `/api/pokemon?offset=${offset}&limit=${LIMIT}`
        ).then(results => {
            console.log("La petición funcionó",results);
            return results;
        }).catch(error => {
            console.error("Error:", error);
        })
        .finally(() => {
            console.log("Petición finalizada");
        });;

        if (!response.ok) {
            throw new Error('Error al obtener los Pokémon');
        }

        const data = await response.json();

        currentOffset = offset;
        totalPokemon = data.count;

        renderPokemon(data.results);

        updatePagination();

    } catch (error) {

        console.error(error);

        pokemonContainer.innerHTML = `
            <p class="error">
                No se pudieron cargar los Pokémon.
            </p>
        `;
    }
}


function renderPokemon(pokemonList) {

    pokemonContainer.innerHTML = '';

    pokemonList.forEach(pokemon => {

        const card = document.createElement('article');

        card.classList.add('pokemon-card');

        card.innerHTML = `
            <div class="pokemon-image">
                <img 
                    src="${pokemon.image}" 
                    alt="${pokemon.name}"
                >
            </div>

            <div class="pokemon-info">

                <span class="pokemon-id">
                    #${String(pokemon.id).padStart(3, '0')}
                </span>

                <h2>
                    ${capitalize(pokemon.name)}
                </h2>

                <div class="types">
                    ${pokemon.types
                        .map(type => `
                            <span class="type">
                                ${capitalize(type)}
                            </span>
                        `)
                        .join('')}
                </div>

                <div class="stats">

                    <div>
                        <strong>Altura</strong>
                        <span>${pokemon.height / 10} m</span>
                    </div>

                    <div>
                        <strong>Peso</strong>
                        <span>${pokemon.weight / 10} kg</span>
                    </div>

                </div>

                <div class="abilities">

                    <strong>Habilidades</strong>

                    <ul>
                        ${pokemon.abilities
                            .map(ability => `
                                <li>
                                    ${capitalize(ability)}
                                </li>
                            `)
                            .join('')}
                    </ul>

                </div>

            </div>
        `;

        pokemonContainer.appendChild(card);
    });
}


function updatePagination() {

    const currentPage =
        Math.floor(currentOffset / LIMIT) + 1;

    const totalPages =
        Math.ceil(totalPokemon / LIMIT);

    pageInfo.textContent =
        `Página ${currentPage} de ${totalPages}`;

    previousBtn.disabled =
        currentOffset === 0;

    nextBtn.disabled =
        currentOffset + LIMIT >= totalPokemon;
}


function capitalize(text) {

    return text.charAt(0).toUpperCase() + text.slice(1);

}


previousBtn.addEventListener('click', () => {

    if (currentOffset >= LIMIT) {

        loadPokemon(currentOffset - LIMIT);

    }

});


nextBtn.addEventListener('click', () => {

    if (currentOffset + LIMIT < totalPokemon) {

        loadPokemon(currentOffset + LIMIT);

    }

});


loadPokemon();