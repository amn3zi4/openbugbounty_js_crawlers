(async function bountyProgramParser() {
    const CONFIG = {
        maxPages: 250,              // parsing pages count
        direction: 'next',          // crawl direction next or prev
        delayMs: 10,               // delay between swipes
        filterTotalMin: 0,          //  from this value of total reports to next one
        filterTotalMax: 0
    };
    function parseCurrentPage() {
        const rows = document.querySelectorAll('#bugbounty-list tbody tr');
        const found = [];
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                const nameCell = cells[0];
                const link = nameCell?.querySelector('a');
                const url = link?.href || '';
                const name = link?.textContent.trim() || '';
                const statsCell = cells[2];
                const totalBold = statsCell?.querySelector('b');
                const totalText = totalBold?.textContent.trim() || '';
                const total = parseInt(totalText) || 0;
                if (total >= CONFIG.filterTotalMin && total <= CONFIG.filterTotalMax && url) {
                    found.push(url);
                }
            }
        });
        return found;
    }
    function goToNextPage() {
        const nextBtn = document.querySelector('#bugbounty-list_paginate .paginate_button.next:not(.disabled)');
        if (nextBtn) {
            nextBtn.click();
            return true;
        }
        return false;
    }
    function goToPrevPage() {
        const prevBtn = document.querySelector('#bugbounty-list_paginate .paginate_button.previous:not(.disabled)');
        if (prevBtn) {
            prevBtn.click();
            return true;
        }
        return false;
    }
    function waitForTableUpdate() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                const processing = document.querySelector('#bugbounty-list_processing');
                if (!processing || processing.style.display === 'none') {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
            }, 3000);
        });
    }
    const allUrls = [];
    let currentPage = 1;
    console.log('='.repeat(60));
    for (let page = 0; page < CONFIG.maxPages; page++) {
        console.log(`\nPage ${currentPage} of ${CONFIG.maxPages}...`);
        const urlsOnPage = parseCurrentPage();
        allUrls.push(...urlsOnPage);
        console.log(`   Found ${urlsOnPage.length} links (all: ${allUrls.length})`);
        if (page === CONFIG.maxPages - 1) {
            break;
        }
        let moved = false;
        if (CONFIG.direction === 'next') {
            moved = goToNextPage();
        } else {
            moved = goToPrevPage();
        }
        if (!moved) {
            console.log('End of pages...');
            break;
        }
        await waitForTableUpdate();
        await new Promise(resolve => setTimeout(resolve, CONFIG.delayMs));
        currentPage++;
    }
    console.log('\n' + '='.repeat(60));
    console.log(`Links count: ${allUrls.length}`);
    console.log('='.repeat(60));
    if (allUrls.length > 0) {
        const uniqueUrls = [...new Set(allUrls)];
        if (uniqueUrls.length !== allUrls.length) {
        }
        window.BOUNTY_URLS = uniqueUrls;
        console.log('\nLinks:');
        console.log('-'.repeat(40));
        console.log(uniqueUrls.join('\n'));
        console.log('-'.repeat(40));
        console.log('\nLinks saved to window.BOUNTY_URLS');
    } else {
        console.log('Nothing found');
    }
    return allUrls;
})();
