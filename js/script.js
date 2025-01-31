const upgradeCosts = {
    greenToBlue: { insig: 130, material: 60, znak: 1, details: 12, dust: 110, amalgam: 20, gold: 73500 },
    blueToPurple: { insig: 220, material: 105, znak: 2, details: 11, dust: 100, amalgam: 19, gold: 89000 },
    purpleToOrange: { insig: 390, material: 135, znak: 3, details: 14, dust: 130, amalgam: 135, gold: 116000 }
};

const upgradeCostsWeapon = {
    greenToBlue: { insig: 390, material: 180, znak: 5, details: 27, dust: 255, amalgam: 48, gold: 220500 },
    blueToPurple: { insig: 660, material: 315, znak: 5, details: 33, dust: 300, amalgam: 57, gold: 267000 },
    purpleToOrange: { insig: 1170, material: 405, znak: 5, details: 42, dust: 390, amalgam: 69, gold: 348000 }
};

const upgradeCostsShield = {
    greenToBlue: { insig: 260, material: 0, znak: 0, details: 12, dust: 120, amalgam: 24, gold: 106000 },
    blueToPurple: { insig: 440, material: 0, znak: 0, details: 12, dust: 120, amalgam: 24, gold: 106000 },
    purpleToOrange: { insig: 780, material: 0, znak: 0, details: 16, dust: 160, amalgam: 135, gold: 140000 }
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
        insig: 0,
        material: 0,
        znak: 0,
        details: 0,
        dust: 0,
        amalgam: 0,
        gold: 0,
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

        resources.insig = upgradePath.insig * count;
        resources.details = upgradePath.details * count;
        resources.znak = upgradePath.znak * count;
        resources.dust = upgradePath.dust * count;
        resources.amalgam = upgradePath.amalgam * count;
        resources.gold = upgradePath.gold * count;
        resources.material = upgradePath.material * count;

        if (isWeapon) {
            resources.insig += weaponUpgradePath.insig;
            resources.details += weaponUpgradePath.details;
            resources.znak += weaponUpgradePath.znak;
            resources.dust += weaponUpgradePath.dust;
            resources.amalgam += weaponUpgradePath.amalgam;
            resources.gold += weaponUpgradePath.gold;
            resources.material += weaponUpgradePath.material;
        }

        if (isShield) {
            const shieldUpgradePath = upgradeCostsShield[quality === 'green' ? 'greenToBlue' : quality === 'blue' ? 'blueToPurple' : 'purpleToOrange'];
            resources.insig += shieldUpgradePath.insig;
            resources.details += shieldUpgradePath.details;
            resources.znak += shieldUpgradePath.znak;
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
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="card-title quality-${quality} mb-0">Результаты расчета</h2>
                <button class="btn btn-outline-success d-flex align-items-center" id="save-png">
                    <i class="bi bi-image"></i>
                    <span class="ms-2 d-none d-md-inline">Сохранить результат</span>
                </button>
            </div>
            <div class="table-responsive">
                <table class="table table-bordered mb-0">
                    <thead>
                        <tr>
                            <th>Ресурс</th>
                            <th class="text-end">Количество</th>
                        </tr>
                    </thead>
                    <tbody>`;

    if (resources.insig > 0) {
        resultHTML += `<tr><td>Знаки инсигний героя<span class="tooltip-icon" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="<img src='img/insig.png' class='tooltip-image'>">?</span></td><td class="text-end">${formatNumber(resources.insig)}</td></tr>`;
    }

    if (resources.znak > 0) {
        resultHTML += `<tr><td>Знаки астралиума<span class="tooltip-icon" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="<img src='img/znak.png' class='tooltip-image'>">?</span></td><td class="text-end">${formatNumber(resources.znak)}</td></tr>`;
    }

    if (resources.material > 0) {
        resultHTML += `<tr><td>Зачарованный материал<span class="tooltip-icon" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="<img src='img/material.png' class='tooltip-image'>">?</span></td><td class="text-end">${formatNumber(resources.material)}</td></tr>`;
    }

    if (resources.dust > 0) {
        resultHTML += `<tr><td>Зачарованная пыльца<span class="tooltip-icon" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="<img src='img/dust.png' class='tooltip-image'>">?</span></td><td class="text-end">${formatNumber(resources.dust)}</td></tr>`;
    }

    if (resources.details > 0) {
        resultHTML += `<tr><td>Мастеровые детали<span class="tooltip-icon" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="<img src='img/master.png' class='tooltip-image'>">?</span></td><td class="text-end">${formatNumber(resources.details)}</td></tr>`;
    }

    if (resources.amalgam > 0) {
        resultHTML += `<tr><td>Амальгама<span class="tooltip-icon" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title="<img src='img/amalgam.png' class='tooltip-image'>">?</span></td><td class="text-end">${formatNumber(resources.amalgam)}</td></tr>`;
    }

    if (resources.gold > 0) {
        let tooltipText = '';
        const quality = document.getElementById('item-quality').value;
        const count = Math.min(Math.max(parseInt(document.getElementById('item-count').value) || 1, 1), 15);
        const craftCost = quality === 'green' ? 73500 * count : quality === 'blue' ? 89000 * count : 116000 * count;
        tooltipText += `Предметы экипировки: ${formatNumber(craftCost)} \n`;
        
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
            tooltipText += `Двуруч и скипетр: ${formatNumber(weaponCost)} \n`;
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
            tooltipText += `Одноруч и щит: ${formatNumber(shieldCost)} `;
        }
        
        resultHTML += `<tr><td>Золото</td><td class="text-end">${formatNumber(resources.gold)} <span class="tooltip-icon" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" title="${tooltipText}" style="cursor: help;">?</span></td></tr>`;
    }

    resultHTML += `</tbody></table></div></div>`;

    newResults.innerHTML = resultHTML;
    resultsDiv.innerHTML = '';
    resultsDiv.appendChild(newResults);
    resultsDiv.classList.add('visible');

    const saveButton = document.getElementById('save-png');
    if(saveButton) {
        saveButton.addEventListener('click', saveAsPNG);
    }

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

function saveAsPNG() {
    const element = document.querySelector('.new-result');
    if (!element) return;

    const watermark = document.createElement('div');
    watermark.className = 'watermark';
    watermark.textContent = 'https://sysxda.github.io/allodsmaterialcalc';
    element.appendChild(watermark);

    html2canvas(element, {
        scale: 2,
        useCORS: true,
        onclone: (clonedDoc) => {
            clonedDoc.querySelector('.watermark')?.classList.add('watermark');
        }
    }).then(canvas => {
        const fileName = 'equipment_results.png';

        canvas.toBlob((blob) => {
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.href = url;
            link.download = fileName;

            if ('download' in link) {
                link.click();
            } else {
                window.open(url, '_blank');
            }

            setTimeout(() => URL.revokeObjectURL(url), 100);
            element.removeChild(watermark);
        }, 'image/png');
    }).catch(error => {
        console.error('Ошибка:', error);
        watermark.parentElement?.removeChild(watermark);
    });
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