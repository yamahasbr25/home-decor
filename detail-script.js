document.addEventListener('DOMContentLoaded', function() {
    const detailTitle = document.getElementById('detail-title');
    const detailImageContainer = document.getElementById('detail-image-container');
    const detailBody = document.getElementById('detail-body');
    const relatedPostsContainer = document.getElementById('related-posts-container');
    const params = new URLSearchParams(window.location.search);
    const keywordFromQuery = params.get('q') || '';
    const keyword = keywordFromQuery.replace(/-/g, ' ').trim();

    function capitalizeEachWord(str) { 
        if (!str) return ''; 
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '); 
    }

    // ▼▼▼ PERUBAHAN: hookWords, generateSeoTitle untuk Home Decor ▼▼▼
    function generateSeoTitle(baseKeyword) { 
        // Hook words baru untuk Home Decor
        const hookWords = ['Stunning', 'Chic', 'Creative', 'Affordable', 'Modern', 'Cozy', 'Elegant', 'Ultimate', 'Simple', 'Inspiring']; 
        const randomHook = hookWords[Math.floor(Math.random() * hookWords.length)]; 
        const randomNumber = Math.floor(Math.random() * (50 - 10 + 1)) + 10; // Tetap opsional
        const capitalizedKeyword = capitalizeEachWord(baseKeyword); 
        // Mengubah format judul menjadi lebih fokus pada desain/ide
        return `${randomHook} ${capitalizedKeyword} Design Ideas`; 
    }

    // Fungsi Spintax tetap sama
    function processSpintax(text) {
        const spintaxPattern = /{([^{}]+)}/g;
        while (spintaxPattern.test(text)) {
            text = text.replace(spintaxPattern, (match, choices) => {
                const options = choices.split('|');
                return options[Math.floor(Math.random() * options.length)];
            });
        }
        return text;
    }

    if (!keyword) { 
        detailTitle.textContent = 'Decor Idea Not Found'; 
        detailBody.innerHTML = '<p>Sorry, the requested home decor idea could not be found. Please return to the <a href="index.html">homepage</a>.</p>'; 
        if (relatedPostsContainer) { 
            relatedPostsContainer.closest('.related-posts-section').style.display = 'none'; 
        } 
        return; 
    }

    function populateMainContent(term) {
        const newTitle = generateSeoTitle(term);
        const capitalizedTermForArticle = capitalizeEachWord(term);
        document.title = `${newTitle} | HomeDecorSpot`; // Mengubah nama blog
        detailTitle.textContent = newTitle;

        // ▼▼▼ imageUrl TIDAK DIRUBAH (sesuai permintaan) ▼▼▼
        const imageUrl = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(term)}&w=800&h=1200&c=7&rs=1&p=0&dpr=1.5&pid=1.7`;
        detailImageContainer.innerHTML = `<img src="${imageUrl}" alt="${newTitle}">`;

        // ▼▼▼ PERUBAHAN: ARTIKEL BARU untuk Home Decor dengan format Spintax ▼▼▼
        const spintaxArticleTemplate = `
            <p>{Welcome|Hello, design enthusiasts|Greetings, home stylers} to our blog! {This time|In this feature|On this page}, we will {explore|share|discover} {gorgeous|inspiring|chic} ideas for styling your space with <strong>${capitalizedTermForArticle}</strong>.
            {Finding|Discovering} the {right|perfect|most cohesive} design for <strong>${capitalizedTermForArticle}</strong> {can sometimes be a challenge|requires an eye for detail|is often easier said than done}.
            {That's why|Therefore}, we've {curated|gathered|presented} {a variety of|several} of the {best concepts|most sought-after ideas} for {you|our loyal readers}.</p>            
        `;

        // Proses Spintax dan tampilkan hasilnya
        detailBody.innerHTML = processSpintax(spintaxArticleTemplate);
    }

    // ▼▼▼ generateRelatedPosts TIDAK DIRUBAH (sesuai permintaan) ▼▼▼
    function generateRelatedPosts(term) {
        const script = document.createElement('script');
        script.src = `https://suggestqueries.google.com/complete/search?jsonp=handleRelatedSuggest&hl=en&client=firefox&q=${encodeURIComponent(term)}`;
        document.head.appendChild(script);
        script.onload = () => script.remove();
        script.onerror = () => { relatedPostsContainer.innerHTML = '<div class="loading-placeholder">Could not load related recipes.</div>'; script.remove(); }
    }

    window.handleRelatedSuggest = function(data) {
        const suggestions = data[1];
        relatedPostsContainer.innerHTML = '';
        if (!suggestions || suggestions.length === 0) { relatedPostsContainer.closest('.related-posts-section').style.display = 'none'; return; }
        const originalKeyword = keyword.toLowerCase();
        let relatedCount = 0;
        suggestions.forEach(relatedTerm => {
            if (relatedTerm.toLowerCase() === originalKeyword || relatedCount >= 11) return;
            relatedCount++;
            const keywordForUrl = relatedTerm.replace(/\s/g, '-').toLowerCase();
            const linkUrl = `detail.html?q=${encodeURIComponent(keywordForUrl)}`;
            
            const imageUrl = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(relatedTerm)}&w=600&h=900&c=7&rs=1&p=0&dpr=1.5&pid=1.7`;
            const newRelatedTitle = generateSeoTitle(relatedTerm);
            const card = `<article class="content-card"><a href="${linkUrl}"><img src="${imageUrl}" alt="${newRelatedTitle}" loading="lazy"><div class="content-card-body"><h3>${newRelatedTitle}</h3></div></a></article>`;
            relatedPostsContainer.innerHTML += card;
        });
        if (relatedCount === 0) { relatedPostsContainer.closest('.related-posts-section').style.display = 'none'; }
    };

    populateMainContent(keyword);
    generateRelatedPosts(keyword);
});
