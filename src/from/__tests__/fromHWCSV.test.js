import { readFileSync } from 'fs';
import { join } from 'path';

import { fromHWCSV } from '../fromHWCSV';

test('fromHWCSV', () => {
  let file = readFileSync(
    join(__dirname, '../../../testFiles/200217-test1.csv'),
    'utf8',
  );

  const analysis = fromHWCSV(file);
  const spectra = analysis.getSpectra();

  expect(spectra).toHaveLength(5);

  for (let i = 0; i < 5; i++) {
    expect(spectra[i].variables.x.data).toHaveLength(2642);
    expect(spectra[i].variables.y.data).toHaveLength(2642);
    expect(spectra[i].meta.id).toBe('HAL V RC RGA 201 #12461');
    expect(spectra[i].meta.scans).toHaveLength(5);
    expect(spectra[i].meta.date).toBe('17/02/2020');
    expect(spectra[i].meta.mass).toStrictEqual(5.5);
    expect(spectra[i].meta.deltaM).toStrictEqual(0);
    expect(spectra[i].meta.emission).toStrictEqual(450);
    expect(spectra[i].variables.x.data[0]).toStrictEqual(1002);
    expect(spectra[i].variables.x.data[2641]).toStrictEqual(22178180);
  }

  expect(spectra[0].variables.y.label).toBe('Carbon dioxide');
  expect(spectra[1].variables.y.label).toBe('Nitrogen');
  expect(spectra[2].variables.y.label).toBe('Water');
  expect(spectra[3].variables.y.label).toBe('Oxygen');
  expect(spectra[4].variables.y.label).toBe('Methane');

  expect(spectra[0].variables.y.data[0]).toStrictEqual(7.89279e-9);
  expect(spectra[1].variables.y.data[0]).toStrictEqual(8.6521e-6);
  expect(spectra[2].variables.y.data[0]).toStrictEqual(9.82211e-8);
  expect(spectra[3].variables.y.data[0]).toStrictEqual(2.6083e-6);
  expect(spectra[4].variables.y.data[0]).toStrictEqual(1.17406e-7);

  expect(analysis.getSpectrum('Carbon dioxide vs ms')).toStrictEqual(
    spectra[0],
  );
});
