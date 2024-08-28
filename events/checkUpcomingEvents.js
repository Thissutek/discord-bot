const { listEvents, authorize } = require('../calender');
const { calenderId } = require('../config.json')

async function checkUpcomingEvents(client) {
    try {
        const auth = await authorize();
        const events = await listEvents(auth);
        const today = new Date();

        let channel = client.channels.cache.get(calenderId)

        if(!channel) {
            try {
                channel = await client.channels.fetch(calenderId)
                if(!channel) {
                    console.error(`Channel with ID ${calenderId} could not be found`);
                    return;
                }
            } catch (error) {
                console.error(`Failed to fetch channel with ID ${calenderId}:`, error);
                return;
            }
        }
        console.log('Channel fetched successfully', channel.id);

        events.forEach(event => {
            const eventDate = new Date(event.start)

            const daysLeft = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    
            if(daysLeft <= 1) {
                const messageText = `Master, ${event.summary} is happening tomorrow!`

                channel.send(messageText);
                console.log(`Sent upcoming event alert ${event.summary}`)
            }
        })

    } catch (error) {
        console.error('Error in checkUpcomingEvents function', error);
    }
}

function startEventNotificationCheck(client) {
    checkUpcomingEvents(client);

    setInterval(() => checkUpcomingEvents(client), 3600000);
}

module.exports = {startEventNotificationCheck}