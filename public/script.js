const categorySelect = document.getElementById('category');
const languageSelect = document.getElementById('language');
const searchInput = document.getElementById('search');
const fetchBtn = document.getElementById('fetchBtn');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');

fetchBtn.addEventListener('click', fetchData);
searchInput.addEventListener('keyup', () => {
    if (searchInput.value.trim() === '') {
        fetchData();
    }
});

async function fetchData() {
    const category = categorySelect.value;
    const language = languageSelect.value;
    const searchTerm = searchInput.value.trim();

    // Validation
    if (!category) {
        showError('Please select a category');
        return;
    }

    try {
        showLoading(true);
        hideError();
        resultsDiv.innerHTML = '';

        // Build API URL with search parameter if search term exists
        let apiUrl = `/${language}/${category}`;
        if (searchTerm) {
            apiUrl += `?search=${encodeURIComponent(searchTerm)}`;
        }

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || (Array.isArray(data) && data.length === 0)) {
            showError(searchTerm ? `No results found for "${searchTerm}"` : 'No data found for this category');
            return;
        }

        displayResults(data, category);
    } catch (error) {
        console.error('Error fetching data:', error);
        showError(`Error fetching data: ${error.message}`);
    } finally {
        showLoading(false);
    }
}

function displayResults(data, category) {
    // Handle both single object and array responses
    const items = Array.isArray(data) ? data : [data];

    items.forEach((item) => {
        const card = createResultCard(item, category);
        resultsDiv.appendChild(card);
    });
}

function createResultCard(item, category) {
    const card = document.createElement('div');
    card.className = 'result-card';

    let title = '';
    let content = '';

    // Determine the title based on category
    switch (category) {
        case 'books':
            title = item.title || item.name || 'Unknown';
            content = `
                ${item.cover ? `<img src="${item.cover}" alt="${title}" class="result-image">` : ''}
                <div class="result-content">
                    <div class="result-property">
                        <strong>Number:</strong>
                        <span>${item.number || 'N/A'}</span>
                    </div>
                    <div class="result-property">
                        <strong>Original Title:</strong>
                        <span>${item.originalTitle || 'N/A'}</span>
                    </div>
                    <div class="result-property">
                        <strong>Pages:</strong>
                        <span>${item.pages || 'N/A'}</span>
                    </div>
                    <div class="result-property">
                        <strong>Release Date:</strong>
                        <span>${item.releaseDate || 'N/A'}</span>
                    </div>
                    <div class="result-property">
                        <strong>Description:</strong>
                        <span>${item.description || 'N/A'}</span>
                    </div>
                </div>
            `;
            break;
        case 'characters':
            title = item.fullName || item.name || 'Unknown';
            content = `
                ${item.image ? `<img src="${item.image}" alt="${title}" class="result-image">` : ''}
                <div class="result-content">
                    <div class="result-property">
                        <strong>Nickname:</strong>
                        <span>${item.nickname || 'N/A'}</span>
                    </div>
                    <div class="result-property">
                        <strong>Hogwarts House:</strong>
                        <span>${item.hogwartsHouse || 'N/A'}</span>
                    </div>
                    <div class="result-property">
                        <strong>Interpreted By:</strong>
                        <span>${item.interpretedBy || 'N/A'}</span>
                    </div>
                    <div class="result-property">
                        <strong>Birthdate:</strong>
                        <span>${item.birthdate || 'N/A'}</span>
                    </div>
                </div>
            `;
            break;
        case 'houses':
            title = (item.emoji || '') + ' ' + (item.house || 'Unknown');
            content = `
                <div class="result-content">
                    <div class="result-property">
                        <strong>Founder:</strong>
                        <span>${item.founder || 'N/A'}</span>
                    </div>
                    <div class="result-property">
                        <strong>Animal:</strong>
                        <span>${item.animal || 'N/A'}</span>
                    </div>
                    ${item.colors ? `<div class="result-property">
                        <strong>Colors:</strong>
                        <span>${Array.isArray(item.colors) ? item.colors.join(', ') : item.colors}</span>
                    </div>` : ''}
                </div>
            `;
            break;
        case 'spells':
            title = item.spell || 'Unknown';
            content = `
                <div class="result-content">
                    <div class="result-property">
                        <strong>Use:</strong>
                        <span>${item.use || 'N/A'}</span>
                    </div>
                </div>
            `;
            break;
        default:
            title = item.name || JSON.stringify(item).substring(0, 50);
            content = `<div class="result-content"><pre>${JSON.stringify(item, null, 2)}</pre></div>`;
    }

    card.innerHTML = `
        <div class="result-title">${title}</div>
        ${content}
    `;

    return card;
}

function showLoading(show) {
    if (show) {
        loadingDiv.classList.remove('hidden');
    } else {
        loadingDiv.classList.add('hidden');
    }
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    errorDiv.classList.add('hidden');
}
