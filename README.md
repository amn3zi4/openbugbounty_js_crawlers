# OpenBugBounty Parsers

A collection of scripts for parsing data from the OpenBugBounty platform.
Parsers
Both scripts navigate through pages in the specified direction and on each page copy the data they're configured to collect in your browser (Just paste it into the console on the relevant page).

**Important Notice**

OpenBugBounty frequently drops connections or requires Cloudflare verification. For stable operation, it is recommended to fragment the crawling process - for example, crawl in batches of 300 pages and then reload the page to continue.

## 1. Bounty Programs Parser

Collects links to bug bounty programs with filtering by report count.

Where to use: On the page with all bug bounty programs
URL: https://www.openbugbounty.org/bugbounty-list/
## 2. Researcher Reports Parser

Collects domains from a specific researcher's reports with filtering by status.

Where to use: In any researcher's profile (reports section)
URL: https://www.openbugbounty.org/researchers/USERNAME/reports/#tabs-11
Usage
Bounty Programs Parser

    Navigate to: https://www.openbugbounty.org/bugbounty-list/

    Open your browser console (more likely F12 → Console)

    Paste the script and press Enter

    Configure parameters in CONFIG:

        filterTotalMin / filterTotalMax - report count range

        maxPages - number of pages to parse

        direction - navigation direction ('next' or 'prev')

## Filtering examples:

filterTotalMin: 0, filterTotalMax: 0    // programs with zero reports
filterTotalMin: 1, filterTotalMax: 100  // programs with 1-100 reports
filterTotalMin: 50, filterTotalMax: 50  // programs with exactly 50 reports

Researcher Reports Parser

    Navigate to researcher profile: https://www.openbugbounty.org/researchers/USERNAME/reports/#tabs-11

    Open browser console (F12 → Console)

    Paste the script and press Enter

    Configure parameters in CONFIG:

        statusFilter - report status ('any', 'patched', 'unpatched', 'on hold')

        maxPages - number of pages to parse

        direction - navigation direction ('next' or 'prev')

## Output
Bounty Programs Parser

    Saves URLs to window.BOUNTY_URLS

    Prints all collected URLs to console

    Removes duplicates automatically

Researcher Reports Parser

    Saves domains to window.PARSED_DOMAINS

    Prints all collected domains to console

    Removes duplicates automatically

    Shows statistics (pages processed, duplicates removed)

## Configuration

Both parsers share common configuration options:
Parameter	Description	Default
maxPages	Maximum number of pages to parse	250
direction	Navigation direction ('next' or 'prev')	'next' / 'prev'
delayMs	Delay between page navigations (ms)	10
## Tips

    Use the parsers on fully loaded pages

    Adjust delayMs if pages load slowly

    The scripts handle pagination automatically

    Results are stored in global variables for further use

