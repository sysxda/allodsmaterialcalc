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

const upgradeCostsWeapon = {
    greenToBlue: {
        zig: 390,
        material: 180,
        details: 27,
        dust: 255,
        amalgam: 48,
        gold: 220500,
    },
    blueToPurple: {
        zig: 660,
        material: 315,
        details: 33,
        dust: 300,
        amalgam: 57,
        gold: 267000
    },
    purpleToOrange: {
        zig: 1170,
        material: 405,
        details: 42,
        dust: 390,
        amalgam: 69,
        gold: 348000
    }
};

const upgradeCostsShield = {
    greenToBlue: {
        zig: 390,
        material: 180,
        details: 27,
        dust: 255,
        amalgam: 48,
        gold: 220500,
    },
    blueToPurple: {
        zig: 660,
        material: 315,
        details: 33,
        dust: 300,
        amalgam: 57,
        gold: 267000
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
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <div class="card shadow-sm calculating">
            <div class="card-body text-center">
                <div class="spinner-border text-primary mb-2" role="status">
                    <span class="visually-hidden">Выполняется расчет...</span>
                </div>
                <p class="mb-0">Выполняется расчет...</p>
            </div>
        </div>
    `;

    const quality = document.getElementById('item-quality').value;
    const count = Math.min(Math.max(parseInt(document.getElementById('item-count').value) || 1, 1), 15);
    const includeDetailsCraft = document.getElementById('include-details-craft').checked;
    const isWeapon = document.getElementById('is-weapon').checked;
    const isShield = document.getElementById('is-shield').checked;

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
        let weaponUpgradePath;
        
        switch(quality) {
            case 'green':
                upgradePath = upgradeCosts.greenToBlue;
                weaponUpgradePath = upgradeCostsWeapon.greenToBlue;
                break;
            case 'blue':
                upgradePath = upgradeCosts.blueToPurple;
                weaponUpgradePath = upgradeCostsWeapon.blueToPurple;
                break;
            case 'purple':
                upgradePath = upgradeCosts.purpleToOrange;
                weaponUpgradePath = upgradeCostsWeapon.purpleToOrange;
                break;
        }

        resources.zig = upgradePath.zig * count;
        resources.details = upgradePath.details * count;
        resources.dust = upgradePath.dust * count;
        resources.amalgam = upgradePath.amalgam * count;
        resources.gold = upgradePath.gold * count;
        resources.material = upgradePath.material * count;

        if (isWeapon) {
            resources.zig += weaponUpgradePath.zig;
            resources.details += weaponUpgradePath.details;
            resources.dust += weaponUpgradePath.dust;
            resources.amalgam += weaponUpgradePath.amalgam;
            resources.gold += weaponUpgradePath.gold;
            resources.material += weaponUpgradePath.material;
        }

        if (isShield) {
            const shieldUpgradePath = upgradeCostsShield[quality === 'green' ? 'greenToBlue' : quality === 'blue' ? 'blueToPurple' : 'purpleToOrange'];
            resources.zig += shieldUpgradePath.zig;
            resources.details += shieldUpgradePath.details;
            resources.dust += shieldUpgradePath.dust;
            resources.amalgam += shieldUpgradePath.amalgam;
            resources.gold += shieldUpgradePath.gold;
            resources.material += shieldUpgradePath.material;
        }
    }

    if (includeDetailsCraft && resources.details > 0) {
        const craftBatches = Math.ceil(resources.details / 10);
        resources.detailsCraftCost = craftBatches * 6000;
        resources.gold += resources.detailsCraftCost;
    }

    displayResults(resources, quality, includeDetailsCraft);
}

function displayResults(resources, quality, includeDetailsCraft) {
    const resultsDiv = document.getElementById('results');

    const newResults = document.createElement('div');
    newResults.className = 'card shadow-sm new-result';
    
    let resultHTML = `
        <div class="card-body">
            <h3 class="card-title quality-${quality}">Результаты расчета</h3>
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
        resultHTML += `<tr><td>Знак инсигнии героя<span class="tooltip-icon" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="<img src='img/zig.png' class='tooltip-image'>">?</span></td><td class="text-end">${formatNumber(resources.zig)}</td></tr>`;
    }

    if (resources.material > 0) {
        resultHTML += `<tr><td>Зачарованный материал<span class="tooltip-icon" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="<img src='img/material.png' class='tooltip-image'>">?</span></td><td class="text-end">${formatNumber(resources.material)}</td></tr>`;
    }

    if (resources.dust > 0) {
        resultHTML += `<tr><td>Зачарованная пыльца<span class="tooltip-icon" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="<img src='img/pylca.png' class='tooltip-image'>">?</span></td><td class="text-end">${formatNumber(resources.dust)}</td></tr>`;
    }

    if (resources.details > 0) {
        resultHTML += `<tr><td>Мастеровые детали<span class="tooltip-icon" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="<img src='img/master.png' class='tooltip-image'>">?</span></td><td class="text-end">${formatNumber(resources.details)}</td></tr>`;
    }

    if (resources.amalgam > 0) {
        resultHTML += `<tr><td>Амальгама<span class="tooltip-icon" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="<img src='img/alma.png' class='tooltip-image'>">?</span></td><td class="text-end">${formatNumber(resources.amalgam)}</td></tr>`;
    }

    if (resources.gold > 0) {
        let tooltipText = '';
        const quality = document.getElementById('item-quality').value;
        const count = Math.min(Math.max(parseInt(document.getElementById('item-count').value) || 1, 1), 15);
        const craftCost = quality === 'green' ? 73500 * count : quality === 'blue' ? 89000 * count : 116000 * count;
        tooltipText += `Крафт предметов: ${formatNumber(craftCost)} \n`;
        
        if (resources.detailsCraftCost > 0) {
            tooltipText += `Мастеровые детали: ${formatNumber(resources.detailsCraftCost)} \n`;
        }
        if (document.getElementById('is-weapon').checked) {
            let weaponCost = 0;
            const quality = document.getElementById('item-quality').value;
            if (quality === 'green') {
                weaponCost = upgradeCostsWeapon.greenToBlue.gold;
            } else if (quality === 'blue') {
                weaponCost = upgradeCostsWeapon.blueToPurple.gold;
            } else if (quality === 'purple') {
                weaponCost = upgradeCostsWeapon.purpleToOrange.gold;
            }
            tooltipText += `Оружие: ${formatNumber(weaponCost)} \n`;
        }
        if (document.getElementById('is-shield').checked) {
            let shieldCost = 0;
            const quality = document.getElementById('item-quality').value;
            if (quality === 'green') {
                shieldCost = upgradeCostsShield.greenToBlue.gold;
            } else if (quality === 'blue') {
                shieldCost = upgradeCostsShield.blueToPurple.gold;
            } else if (quality === 'purple') {
                shieldCost = upgradeCostsShield.purpleToOrange.gold;
            }
            tooltipText += `Щит: ${formatNumber(shieldCost)} `;
        }
        
        resultHTML += `<tr><td>Золото</td><td class="text-end">${formatNumber(resources.gold)} <span class="tooltip-icon" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${tooltipText}" style="cursor: help;">?</span></td></tr>`;
    }

    resultHTML += `
                            </tbody>
                        </table>
                    </div>
                </div>`;

    newResults.innerHTML = resultHTML;
    resultsDiv.innerHTML = '';
    resultsDiv.appendChild(newResults);
    resultsDiv.classList.add('visible');

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    icon.className = theme === 'dark' ? 'bi-moon-fill' : 'bi-sun-fill';

    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcon(savedTheme);

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    document.getElementById('theme-toggle').addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
});