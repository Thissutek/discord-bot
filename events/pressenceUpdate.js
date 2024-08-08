const { Events } = require('discord.js');

module.exports = {
    name: Events.PresenceUpdate,
    async execute(oldPresence, newPresence) {
        if(newPresence.status === 'online' && (!oldPresence || oldPresence.status !== 'online')) {
            const userId = newPresence.user.username;

            const welcomeMessage = `Welcome back, Master ${userId} It's a pleasure to see you online once more. Do remember to stay hydrated.`


            try {
                const user = await newPresence.client.users.fetch(newPresence.user.id);
                await user.send({ content: welcomeMessage });
            } catch (error) {
                console.error('Error sending welcome message', error)
            }
        }
    }
}