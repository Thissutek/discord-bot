const fs = require('fs').promises;
const path = require('path');


const DATA_FILE = path.join(_dirname, 'databases', 'refrigeratorData.json');


function createFoodItem(name, category, purchaseDate, expiryDuration, exactExpiryDate = null) {
    return {
        name,
        category,
        purchaseDate,
        expiryDuration,
        exactExpiryDate,
    };
}

async function loadRefrigeratorData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.log('Error loading refridgerator data')
    }
}

async function saveRefrigeratorData() {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        console.log('Refrigerator data saved.');
    } catch (error) {
        console.error('Error saving refrigerator data', error)

    }
}

module.exports = { loadRefrigeratorData, saveRefrigeratorData, createFoodItem }