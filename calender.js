const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const { format } = require('date-fns');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
	try {
		const content = await fs.readFile(TOKEN_PATH);
		const credentials = JSON.parse(content);
		return google.auth.fromJSON(credentials);
	}
	catch (err) {
		return null;
	}
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
	const content = await fs.readFile(CREDENTIALS_PATH);
	const keys = JSON.parse(content);
	const key = keys.installed || keys.web;
	const payload = JSON.stringify({
		type: 'authorized_user',
		client_id: key.client_id,
		client_secret: key.client_secret,
		refresh_token: client.credentials.refresh_token,
	});
	await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
	let client = await loadSavedCredentialsIfExist();
	if (client) {
		return client;
	}
	client = await authenticate({
		scopes: SCOPES,
		keyfilePath: CREDENTIALS_PATH,
	});
	if (client.credentials) {
		await saveCredentials(client);
	}
	return client;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

const DATA_FILE = path.join(__dirname, 'eventData.json')

//Save event data to a JSON file
async function saveEventData(eventData) {
	try {
		await fs.writeFile(DATA_FILE, JSON.stringify(eventData, null, 2));
	} catch (err) {
		console.error('Error saving event data', err);
	}
}

//Load evebt data from a file
async function loadEventData() {
	try {
		const data = await fs.readFile(DATA_FILE, 'utf-8');
		return JSON.parse(data);
	} catch (err) {
		return {
			eventIdMap: {},
			availableIds: [],
			nextId: 1
		};
	}
}

const eventIdMap = new Map();
const availableIds = new Set();
let nextId = 1;

async function listEvents(auth) {
	const calendar = google.calendar({version: 'v3', auth});
	const eventData = await loadEventData();

	const res = await calendar.events.list({
	  calendarId: 'primary',
	  timeMin: new Date().toISOString(),
	  maxResults: 10,
	  singleEvents: true,
	  orderBy: 'startTime',
	});


	const events = res.data.items;
	if (!events || events.length === 0) {
	  return 'No upcoming events found.'
	}

	console.log('Upcoming 10 events:');


	const eventsList = events.map((event) => {
	  const start = event.start.dateTime || event.start.date;
	  const formattedDate = format(new Date(start), 'yyyy-MM-dd HH:mm')

	  const simpleId = Object.entries(eventData.eventIdMap).find(([key, value]) => value === event.id)?.[0];

	  return `ID: ${simpleId || 'Unknown'} - ${formattedDate} - ${event.summary}`;
	  
	}).join('\n');
	return eventsList;
  }


async function createEvent(auth, event) {
	const calendar = google.calendar({version: 'v3', auth});
	const eventData = await loadEventData();
	try {
		const response = await calendar.events.insert({
			calendarId: 'primary',
			resource: event,
		  })
		
		let simpleId;
		if (eventData.availableIds.length > 0) {
			simpleId = eventData.availableIds.shift();
		} else {
			simpleId = eventData.nextId++;
		}

		eventData.eventIdMap[simpleId] = response.data.id;
		await saveEventData(eventData);

		return { 
			simpleId, 
			response: response.data,
			htmlLink: response.data.htmlLink
		};
	} catch (error) {
		console.error('There was an error creating the event:', error)
		throw new Error('There was an error contacting the Calender service', error)
	}
}

async function deleteEvent(auth, simpleId) {
	const calendar = google.calendar({version: 'v3', auth});
	const eventData = await loadEventData();
	const eventId = eventData.eventIdMap[simpleId];
	if(!eventId) {
		return `No event found with the ID ${simpleId}`
	}

	try {
		await calendar.events.delete({
			calendarId: 'primary',
			eventId: eventId,
		});

		delete eventData.eventIdMap[simpleId];
		eventData.availableIds.push(simpleId);
		await saveEventData(eventData);

		return `Event with ID ${simpleId} deleted succesfully.`
	} catch (error) {
		console.error('There was an error deleting the event:', error)
		throw new Error('There was an error contacting the Calener Service', error)
	}
}

module.exports = { authorize, listEvents, createEvent, deleteEvent };