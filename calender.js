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
async function listEvents(auth) {
	const calendar = google.calendar({version: 'v3', auth});
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
	const eventsList = events.map((event, i) => {
	  const start = event.start.dateTime || event.start.date;
	  const formattedDate = format(new Date(start), 'yyyy-MM-dd HH:mm')
	  return `${formattedDate} - ${event.summary}`;
	}).join('\n');
	return eventsList;
  }


async function createEvent(auth, event) {
	const calendar = google.calendar({version: 'v3', auth});
	try {
		const response = await calendar.events.insert({
			calendarId: 'primary',
			resource: event,
		  })
		  return response.data
	} catch (error) {
		throw new Error('There was an error contacting the Calender service', error)
	}
}

async function deleteEvent(auth, event) {
	const calendar = google.calendar({version: 'v3', auth});
	try {
		const response = await calendar.events.delete({
			calenderId: 'primary',
			resource: event,
		})
		console.log('Event was deleted successfully', response.status)
	} catch (error) {
		throw new Error('There was an error contacting the Calener Service', error)
	}
}

module.exports = { authorize, listEvents, createEvent, deleteEvent };