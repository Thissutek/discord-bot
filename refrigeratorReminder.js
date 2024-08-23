const fs = require('fs').promises;
const path = require('path');


const DATABASES_DIR = path.join(__dirname, 'databases');
fs.mkdir(DATABASES_DIR, { recursive: true })
	.then(() => console.log('Databases directory created or already exists.'))
	.catch(console.error);
const REFRIGERATOR_DATA_FILE = path.join(DATABASES_DIR, 'refrigeratorData.json');

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
		const data = await fs.readFile(REFRIGERATOR_DATA_FILE, 'utf-8');
		return JSON.parse(data);
	}
	catch (error) {
		console.log('Error loading refridgerator data', error);
		return { items: [] };
	}
}

async function saveRefrigeratorData(data) {
	try {
		await fs.writeFile(REFRIGERATOR_DATA_FILE, JSON.stringify(data, null, 2));
		console.log('Refrigerator data saved.');
	}
	catch (error) {
		console.error('Error saving refrigerator data', error);

	}
}

async function addItem(name, category, expiryDuration, exactExpiryDate = null) {
	const data = await loadRefrigeratorData();
	const purchaseDate = new Date().toISOString();
	const item = createFoodItem(name, category, purchaseDate, expiryDuration, exactExpiryDate);
	data.items.push(item);
	await saveRefrigeratorData(data);
	return item;
}

async function listItems() {
	const data = await loadRefrigeratorData();
	return data.items;
}

async function removeItem(name) {
	const data = await loadRefrigeratorData();

	const initialLength = data.items.length;
	const updatedItems = data.items.filter(item => item.name.toLowerCase() !== name.toLowerCase());

	if (updatedItems.length === initialLength) {
		// No item was removed, meaning the item was not found
		return null;
	}

	data.items = updatedItems;
	await saveRefrigeratorData(data);
	return updatedItems;
}

module.exports = { loadRefrigeratorData, saveRefrigeratorData, createFoodItem, addItem, listItems, removeItem };