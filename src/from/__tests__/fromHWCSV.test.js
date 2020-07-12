import { readFileSync } from 'fs';
import { join } from 'path';

import { fromHWCSV } from '../fromHWCSV';

test('fromTAInstruments', () => {
  let file = readFileSync(
    join(__dirname, '../../../testFiles/200217-test1.csv'),
    'utf8',
  );

  const analysis = fromHWCSV(file);
  const spectra = analysis.getSpectra();

  expect(spectra).toHaveLength(5);

  const spectrum0 = spectra[0];
  expect(spectrum0.data.elapsedTime.data).toHaveLength(2642);
});
