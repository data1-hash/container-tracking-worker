export const MOCK_NOW = '2026-05-07T00:00:00.000Z';

export function createMockDatabase() {
  return {
    Shipment_Master: [
      {
        'Shipment ID': 'SHIP-001',
        'BL No': 'BL123456789',
        'Container No': 'CONT1234567',
        Carrier: 'MockCarrier',
        'Customer Name': 'Mock Customer',
        'Sales Person': 'Mock Sales',
        Origin: 'Shanghai',
        Destination: 'Los Angeles',
        'Current Status': '',
        ETA: '',
        'Previous ETA': '',
        'Last Event': '',
        'Last Location': '',
        Vessel: '',
        Voyage: '',
        Source: '',
        Confidence: '',
        'Last Checked At': '',
        'Review Status': '',
        Error: '',
      },
    ],
    Carrier_Rules: [
      {
        Carrier: 'MockCarrier',
        Active: 'TRUE',
        'Tracking URL Pattern': 'mock://tracking/{number}',
        'Number Type': 'BL',
        'Fetch Mode': 'URLFETCH',
        'Status Regex': 'Status:\\s*([^\\n]+)',
        'ETA Regex': 'ETA:\\s*([^\\n]+)',
        'Vessel Regex': 'Vessel:\\s*([^\\n]+)',
        'Location Regex': 'Location:\\s*([^\\n]+)',
        'CAPTCHA Keywords': 'captcha,human verification,access denied',
        'Parser Mode': 'REGEX',
      },
      {
        Carrier: 'ManualCarrier',
        Active: 'TRUE',
        'Tracking URL Pattern': 'https://manual.example/{number}',
        'Number Type': 'BL',
        'Fetch Mode': 'MANUAL',
        'Status Regex': '',
        'ETA Regex': '',
        'Vessel Regex': '',
        'Location Regex': '',
        'CAPTCHA Keywords': 'captcha',
        'Parser Mode': 'MANUAL',
      },
    ],
    Robot_Queue: [
      {
        'Job ID': 'JOB-001',
        'Shipment ID': 'SHIP-001',
        Carrier: 'MockCarrier',
        'Tracking Number': 'BL123456789',
        'Job Status': 'PENDING',
        Attempts: '0',
        'Next Run At': '',
        'Last Error': '',
        'Created At': MOCK_NOW,
        'Updated At': MOCK_NOW,
      },
    ],
    Manual_Review: [],
    Events_Log: [],
    Alert_Log: [],
  };
}

export function mockTrackingResponse(url) {
  return [
    `URL: ${url}`,
    'Status: Vessel departed origin port',
    'ETA: 2026-06-01',
    'Vessel: MOCK STAR',
    'Voyage: MS123E',
    'Location: Pacific Ocean',
  ].join('\n');
}
