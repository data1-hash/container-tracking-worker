insert into carrier_rules (carrier, active, tracking_url_pattern, fetch_mode, status_regex, eta_regex, vessel_regex, location_regex, captcha_keywords, notes) values
('Oceanic Lines', true, 'https://carrier.example/track/{number}', 'BROWSER', 'Status:\\s*(.+)', 'ETA:\\s*([0-9-]+)', 'Vessel:\\s*(.+)', 'Location:\\s*(.+)', 'captcha,verify you are human,login required', 'Mock-safe template rule'),
('Manual Carrier', true, 'https://carrier.example/manual/{number}', 'MANUAL', null, null, null, null, null, 'Always create manual review') on conflict do nothing;
