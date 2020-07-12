/* eslint-disable prefer-named-capture-group */
/* eslint-disable radix */
import Papa from 'papaparse';

import { Analysis } from '..';

function parseMeta(lines) {
  let meta = { scans: [] };

  for (let [i, line] of lines.entries()) {
    if (line.match(/^"Data"/)) {
      meta.dataStart = i + 1;
      meta.numScans = parseInt(splitTrim(line));
      break;
    }
    if (line.match(/^"Date"/)) {
      meta.date = splitTrim(line);
      meta.time = splitTrim(line, 3);
    }
    if (line.match(/^"ID"/)) {
      meta.id = splitTrim(line);
      meta.version = splitTrim(line, 3);
    }
    if (line.match(/^"Scan ID"/)) {
      meta.scanHeaders = line.split(',').map(function (x) {
        return x.replace(/"/g, '');
      });
    }
    if (line.match(/^"Scan \d+"/)) {
      let scanMeta = {};
      let lineParts = line.split(',');
      for (let [j, item] of meta.scanHeaders.entries()) {
        scanMeta[item] = lineParts[j].replace(/"/g, '');
      }
      meta.scans.push(scanMeta);
    }
    if (line.match(/^"cage"/)) {
      meta.cage = parseFloat(splitTrim(line));
      meta.cageUnit = splitTrim(line, 2);
    }
    if (line.match(/^"delta-m"/)) {
      meta.deltaM = parseFloat(splitTrim(line));
      meta.deltaMUnit = splitTrim(line, 2);
    }
    if (line.match(/^"electron-energy"/)) {
      meta.electronEnergy = parseFloat(splitTrim(line));
      meta.electronEnergyUnit = splitTrim(line, 2);
    }
    if (line.match(/^"emission"/)) {
      meta.emission = parseFloat(splitTrim(line));
      meta.emissionUnit = splitTrim(line, 2);
    }
    if (line.match(/^"focus"/)) {
      meta.focus = parseFloat(splitTrim(line));
      meta.focusUnit = splitTrim(line, 2);
    }
    if (line.match(/^"mass"/)) {
      meta.mass = parseFloat(splitTrim(line));
      meta.massUnit = splitTrim(line, 2);
    }
    if (line.match(/^"mode-change-delay"/)) {
      meta.modeChangeDelay = parseFloat(splitTrim(line));
      meta.modeChangeDelayUnit = splitTrim(line, 2);
    }
    if (line.match(/^"multiplier"/)) {
      meta.multiplier = parseFloat(splitTrim(line));
      meta.multiplierUnit = splitTrim(line, 2);
    }
    if (line.match(/^"resolution"/)) {
      meta.resolution = parseFloat(splitTrim(line));
      meta.resolutionUnit = splitTrim(line, 2);
    }
    if (line.match(/^"Global"/)) {
      meta.global = splitTrim(line);
    }
    if (line.match(/^"F1"/)) {
      meta.f1 = parseInt(splitTrim(line));
      meta.f1Options = splitTrim(line, 2);
    }
    if (line.match(/^"F2"/)) {
      meta.f2 = parseInt(splitTrim(line));
      meta.f2Options = splitTrim(line, 2);
    }
  }

  return meta;
}

export function fromHWCSV(text) {
  let lines = text.split(/\r?\n/).filter((line) => !line.match(/^\s*$/));

  let meta = parseMeta(lines);
  let parsed = Papa.parse(
    lines.slice(meta.dataStart, lines.length).join('\n'),
    {
      skipEmptyLines: true,
      dynamicTyping: true,
    },
  ).data;

  let result = {
    meta: meta,
    data: {
      time: [],
      elapsedTime: [],
    },
  };
  const headerRow = parsed.shift();
  const arrayColumn = (arr, n) => arr.map((x) => x[n]);
  result.data.elapsedTime = arrayColumn(parsed, 1);
  result.data.time = arrayColumn(parsed, 0);

  for (let i = 2; i <= meta.numScans + 1; i++) {
    result.data[headerRow[i]] = arrayColumn(parsed, i);
  }

  let analysis = new Analysis();
  for (let i = 2; i <= meta.numScans + 1; i++) {
    analysis.pushSpectrum(
      {
        x: {
          data: result.data.elapsedTime,
          label: 'elapsed time [ms]',
        },
        y: {
          data: result.data[headerRow[i]],
          label: headerRow[i],
        },
      },
      { dataType: 'breaktrough', title: '', meta: parsed.meta },
    );
  }

  return analysis;
}

function splitTrim(string, item = 1) {
  // eslint-disable-next-line prefer-named-capture-group
  return (
    string
      // eslint-disable-next-line prettier/prettier
    .split(/,/)[item].replace(/^[ \t]*(.*?)[ \t]*$/, '$1')
      .replace(/"/g, '')
  );
}
