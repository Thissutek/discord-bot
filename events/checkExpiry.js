const { listItems } = require('../refrigeratorReminder.js');
const { refrigeratorId } = require('../config.json');
const { EmbedBuilder } = require('@discordjs/builders');

async function checkExpiry(client) {
    const items = await listItems();
    const today = new Date();

    let channel = client.channels.cache.get(refrigeratorId);
    if (!channel) {
        try {
            channel = await client.channels.fetch(refrigeratorId);
            if (!channel) {
                console.error(`Channel with ID ${refrigeratorId} could not be found.`);
                return;
            }
        } catch (error) {
            console.error(`Failed to fetch channel with ID ${refrigeratorId}:`, error);
            return;
        }
    }

    items.forEach(item => {
        const expiryDate = item.exactExpiryDate
            ? new Date(item.exactExpiryDate)
            : new Date(new Date(item.purchaseDate).setDate(new Date(item.purchaseDate).getDate() + Number(item.expiryDuration)));

        const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

        if (daysLeft <= 2) {

            const messageText = `⚠️ ${item.name} (${item.category}) is expiring soon! (${daysLeft} days left)`;
            try {
                channel.send(messageText);
                console.log(`Sent expiry alert for ${item.name}.`);
            } catch (error) {
                console.error('Error sending message to channel:', error);
            }
        }
    });
}

function startExpiryCheck(client) {
    checkExpiry(client);

    setInterval(() => checkExpiry(client), 3600000);  // Check every hour
}

module.exports = { startExpiryCheck };