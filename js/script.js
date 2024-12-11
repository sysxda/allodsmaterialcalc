function getPreferredTheme() {
    const storedTheme = localStorage.getItem('theme')
    return storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme)
    localStorage.setItem('theme', theme)
    updateThemeIcon(theme)
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon')
    icon.className = `bi bi-${theme === 'dark' ? 'sun' : 'moon'}-fill`
}

const upgradeCosts = {
    greenToBlue: {
        zig: 130,
        material: 60,
        details: 12,
        dust: 110,
        amalgam: 20,
        gold: 73500,
    },
    blueToPurple: {
        zig: 220,
        material: 105,
        details: 11,
        dust: 100,
        amalgam: 19,
        gold: 89000
    },
    purpleToOrange: {
        zig: 390,
        details: 14,
        dust: 130,
        amalgam: 135,
        material: 135,
        gold: 116000
        }
};

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function calculateResources() {
    const quality = document.getElementById('item-quality').value;
    const count = Math.min(Math.max(parseInt(document.getElementById('item-count').value) || 1, 1), 15);
    const includeWeapons = document.getElementById('include-weapons').checked;
    const includeDetailsCraft = document.getElementById('include-details-craft').checked;

    const resources = {
        zig: 0,
        details: 0,
        dust: 0,
        amalgam: 0,
        gold: 0,
        material: 0,
        detailsCraftCost: 0
    };

    if (quality !== 'orange') {
        let upgradePath;
        switch(quality) {
            case 'green':
                upgradePath = upgradeCosts.greenToBlue;
                break;
            case 'blue':
                upgradePath = upgradeCosts.blueToPurple;
                break;
            case 'purple':
                upgradePath = upgradeCosts.purpleToOrange;
                break;
        }

        resources.zig = upgradePath.zig * count;
        resources.details = upgradePath.details * count;
        resources.dust = upgradePath.dust * count;
        resources.amalgam = upgradePath.amalgam * count;
        resources.gold = upgradePath.gold * count;
        resources.material = upgradePath.material * count;

        if (includeWeapons) {
            resources.zig += upgradePath.zig * 3;
            resources.details += upgradePath.details * 3;
            resources.dust += upgradePath.dust * 3;
            resources.amalgam += upgradePath.amalgam * 3;
            resources.gold += upgradePath.gold * 3;
            resources.material += upgradePath.material * 3;
        }
    }

    if (includeDetailsCraft && resources.details > 0) {
        const craftBatches = Math.ceil(resources.details / 10);
        resources.detailsCraftCost = craftBatches * 6000;
        resources.gold += resources.detailsCraftCost;
    }

    displayResults(resources);
}

function displayResults(resources) {
    const resultsDiv = document.getElementById('results');
    const includeDetailsCraft = document.getElementById('include-details-craft').checked;
    const quality = document.getElementById('item-quality').value;
    
    let resultHTML = `
        <div class="card shadow-sm">
            <div class="card-body">
                <h3 class="card-title quality-${quality}">Результаты:</h3>
                <div class="table-responsive">
                    <table class="table table-bordered mb-0">
                        <thead>
                            <tr>
                                <th>Ресурс</th>
                                <th class="text-end">Количество</th>
                            </tr>
                        </thead>
                        <tbody>`;

    if (resources.zig > 0) {
        resultHTML += `<tr><td>Знак инсигнии героя <span class="tooltip-icon" data-bs-toggle="tooltip" data-bs-html="true" title="<img src='img/zig.png' class='tooltip-image'>">?</span></td><td class="text-end">${formatNumber(resources.zig)}</td></tr>`;
    }

    if (resources.material > 0) {
        resultHTML += `<tr><td>Зачарованный материал <span class="tooltip-icon" data-bs-toggle="tooltip" data-bs-html="true" title="<img src='img/material.png' class='tooltip-image'>">?</span></td><td class="text-end">${formatNumber(resources.material)}</td></tr>`;
    }

    if (resources.dust > 0) {
        resultHTML += `<tr><td>Зачарованная пыльца <span class="tooltip-icon" data-bs-toggle="tooltip" data-bs-html="true" title="<img src='img/pylca.png' class='tooltip-image'>">?</span></td><td class="text-end">${formatNumber(resources.dust)}</td></tr>`;
    }

    if (resources.details > 0) {
        resultHTML += `<tr><td>Мастеровые детали <span class="tooltip-icon" data-bs-toggle="tooltip" data-bs-html="true" title="<img src='img/master.png' class='tooltip-image'>">?</span></td><td class="text-end">${formatNumber(resources.details)}</td></tr>`;
    }

    if (resources.amalgam > 0) {
        resultHTML += `<tr><td>Амальгама <span class="tooltip-icon" data-bs-toggle="tooltip" data-bs-html="true" title="<img src='img/alma.png' class='tooltip-image'>">?</span></td><td class="text-end">${formatNumber(resources.amalgam)}</td></tr>`;
    }

    if (resources.gold > 0) {
        resultHTML += `<tr><td>Золото</td><td class="text-end">${formatNumber(resources.gold)}${includeDetailsCraft && resources.detailsCraftCost > 0 ? ` <small class="text-muted">(включая ${formatNumber(resources.detailsCraftCost)} за крафт Мастеровых деталей)</small>` : ''}</td></tr>`;
    }

    resultHTML += `
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`;
    
    resultsDiv.innerHTML = resultHTML;

    const tooltips = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
}

document.addEventListener('DOMContentLoaded', () => {
    setTheme(getPreferredTheme())

    document.getElementById('theme-toggle').addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme')
        setTheme(currentTheme === 'dark' ? 'light' : 'dark')
    })

    const itemCountInput = document.getElementById('item-count')
    itemCountInput.addEventListener('input', function() {
        this.value = Math.min(Math.max(parseInt(this.value) || 1, 1), 15)
    })

    const inputs = ['item-quality', 'item-count', 'include-weapons', 'include-details-craft']
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('change', calculateResources)
    })

    calculateResources()
})