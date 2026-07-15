(async function paginatedParser() {
    const CONFIG = {
        maxPages: 250,              // parsing pages count
        direction: 'next',          // crawl direction next or prev
        delayMs: 10,               // delay between swipes
        statusFilter: 'any'         // status: 'any', 'on hold', 'patched', 'unpatched'
    };
    const allDomains = [];
    let currentPage = 1;
    let hasMorePages = true;
    console.log(`Filter: "${CONFIG.statusFilter}"`);
    function parseCurrentPage() {
        const rows = document.querySelectorAll('#researcher-list tbody tr');
        const found = [];
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 4) {
                const status = cells[2]?.textContent.trim().toLowerCase();
                const validStatuses = ['on hold', 'patched', 'unpatched'];
                let statusMatch = false;
                if (CONFIG.statusFilter.toLowerCase() === 'any') {
                    statusMatch = validStatuses.includes(status);
                } else {
                    statusMatch = status === CONFIG.statusFilter.toLowerCase();
                }
                if (statusMatch) {
                    const link = cells[0]?.querySelector('a');
                    if (link) {
                        const domain = link.textContent.trim();
                        if (domain) {
                            found.push(domain);
                        }
                    }
                }
            }
        });
        return found;
    }
    function goToNextPage() {
        const nextBtn = document.querySelector('#researcher-list_paginate .paginate_button.next:not(.disabled)');
        if (nextBtn) {
            nextBtn.click();
            return true;
        }
        return false;
    }
    function goToPrevPage() {
        const prevBtn = document.querySelector('#researcher-list_paginate .paginate_button.previous:not(.disabled)');
        if (prevBtn) {
            prevBtn.click();
            return true;
        }
        return false;
    }
    function waitForTableUpdate() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                const processing = document.querySelector('#researcher-list_processing');
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
    for (let page = 0; page < CONFIG.maxPages; page++) {
        console.log(`\nPage ${currentPage} of ${CONFIG.maxPages}...`);
        const domainsOnPage = parseCurrentPage();
        allDomains.push(...domainsOnPage);
        console.log(`Found: ${domainsOnPage.length} domains (all: ${allDomains.length})`);
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
            console.log('End of pages');
            break;
        }
        await waitForTableUpdate();
        await new Promise(resolve => setTimeout(resolve, CONFIG.delayMs));
        currentPage++;
    }
    console.log('\n' + '='.repeat(50));
    console.log(`Finished`);
    console.log(`Pages crawled: ${currentPage}`);
    console.log(`Domains found: ${allDomains.length}`);
    console.log('='.repeat(50));
    if (allDomains.length > 0) {
        const uniqueDomains = [...new Set(allDomains)];
        console.log('\nDomains:');
        console.log('-'.repeat(30));
        console.log(uniqueDomains.join('\n'));
        console.log('-'.repeat(30));
        window.PARSED_DOMAINS = uniqueDomains;
        console.log('\nDomains saved to window.PARSED_DOMAINS');
    } else {
        console.log('Nothing found');
    }
    return allDomains;
})();
