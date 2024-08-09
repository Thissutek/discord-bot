const { Events } = require('discord.js');

// Timer for hydration check
const HYDRATION_INTERVAL = 30 * 60 * 1000

const hydrationReminders = new Map();

module.exports = {
    name: Events.PresenceUpdate,
    async execute(oldPresence, newPresence) {
        if(newPresence.status === 'online' && (!oldPresence || oldPresence.status !== 'online')) {
            const userId = newPresence.user.username;
            const user = await newPresence.client.users.fetch(newPresence.user.id);
            const welcomeMessage = `Welcome back, Master ${userId} It's a pleasure to see you online once more. Do remember to stay hydrated.`

            try {
                await user.send({ content: welcomeMessage });

                startHydrationReminder(user)
            } catch (error) {
                console.error('Error sending welcome message', error)
            }
        }

        if (newPresence.status === 'offline' && oldPresence && oldPresence.status === 'online') {
            clearHydrationReminder(newPresence.user);
        }
    },
};

function startHydrationReminder(user) {
    if(hydrationReminders.has(user.id)) {
        clearInterval(hydrationReminders.get(user.id));
    }

    const interval = setInterval(async () => { 
        try {
            await user.send('Master, a quick reminder: staying hydrated is crucial. Do take a moment to drink some water—it is good for you.')
        } catch (error) {
            console.error('Error sending hydration reminder:', error);
            clearInterval(interval);
            hydrationReminders.delete(user.id);
        }
    }, HYDRATION_INTERVAL);

    hydrationReminders.set(user.id, interval);
}

function clearHydrationReminder(user) {
    if(hydrationReminders.has(user.id)) {
        clearInterval(hydrationReminders.get(user.id));
        hydrationReminders.delete(user.id);
    }
}