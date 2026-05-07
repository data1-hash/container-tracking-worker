import { google } from 'googleapis';
import { createMockDatabase } from './mockData.js';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export const TAB_NAMES = {
  shipments: 'Shipment_Master',
  rules: 'Carrier_Rules',
  queue: 'Robot_Queue',
  manualReview: 'Manual_Review',
  events: 'Events_Log',
  alerts: 'Alert_Log',
};

export const HEADERS = {
  [TAB_NAMES.shipments]: [
    'Shipment ID', 'BL No', 'Container No', 'Carrier', 'Customer Name', 'Sales Person', 'Origin', 'Destination',
    'Current Status', 'ETA', 'Previous ETA', 'Last Event', 'Last Location', 'Vessel', 'Voyage', 'Source',
    'Confidence', 'Last Checked At', 'Review Status', 'Error',
  ],
  [TAB_NAMES.rules]: [
    'Carrier', 'Active', 'Tracking URL Pattern', 'Number Type', 'Fetch Mode', 'Status Regex', 'ETA Regex',
    'Vessel Regex', 'Location Regex', 'CAPTCHA Keywords', 'Parser Mode',
  ],
  [TAB_NAMES.queue]: [
    'Job ID', 'Shipment ID', 'Carrier', 'Tracking Number', 'Job Status', 'Attempts', 'Next Run At', 'Last Error',
    'Created At', 'Updated At',
  ],
  [TAB_NAMES.manualReview]: [
    'Review ID', 'Shipment ID', 'Carrier', 'Tracking Number', 'Reason', 'Carrier URL', 'Manual Text', 'Review Status',
    'Created At', 'Updated At',
  ],
  [TAB_NAMES.events]: [
    'Event ID', 'Shipment ID', 'Event Date', 'Carrier', 'Tracking Number', 'Status', 'ETA', 'Vessel', 'Voyage',
    'Location', 'Raw Event', 'Source', 'Confidence',
  ],
  [TAB_NAMES.alerts]: [
    'Alert ID', 'Shipment ID', 'Alert Type', 'Message', 'Sent To', 'Status', 'Created At',
  ],
};

function rowsToObjects(values) {
  const [headers = [], ...rows] = values;
  return rows
    .filter((row) => row.some((cell) => String(cell ?? '').trim() !== ''))
    .map((row, rowOffset) => ({
      rowNumber: rowOffset + 2,
      data: Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ''])),
    }));
}

function objectToRow(tabName, row) {
  return HEADERS[tabName].map((header) => row[header] ?? '');
}

function parseServiceAccount(json) {
  try {
    return JSON.parse(json);
  } catch (error) {
    throw new Error(`GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON: ${error.message}`);
  }
}

export class GoogleSheetsStore {
  constructor(config) {
    const credentials = parseServiceAccount(config.googleServiceAccountJson);
    const auth = new google.auth.GoogleAuth({ credentials, scopes: SCOPES });
    this.spreadsheetId = config.spreadsheetId;
    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async getRows(tabName) {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${tabName}!A:Z`,
    });

    return rowsToObjects(response.data.values ?? []);
  }

  async updateRow(tabName, rowNumber, row) {
    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${tabName}!A${rowNumber}:Z${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [objectToRow(tabName, row)] },
    });
  }

  async appendRow(tabName, row) {
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: `${tabName}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [objectToRow(tabName, row)] },
    });
  }
}

export class MockSheetsStore {
  constructor(database = createMockDatabase()) {
    this.database = database;
  }

  async getRows(tabName) {
    return this.database[tabName].map((data, index) => ({ rowNumber: index + 2, data: { ...data } }));
  }

  async updateRow(tabName, rowNumber, row) {
    const index = rowNumber - 2;
    if (index < 0 || index >= this.database[tabName].length) {
      throw new Error(`Cannot update missing row ${tabName}!${rowNumber}`);
    }

    this.database[tabName][index] = { ...this.database[tabName][index], ...row };
  }

  async appendRow(tabName, row) {
    this.database[tabName].push({ ...row });
  }
}

export function createSheetsStore(config) {
  return config.mockMode ? new MockSheetsStore() : new GoogleSheetsStore(config);
}
