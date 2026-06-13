/* Pickup Tuner UI kit — shared model helpers (plain JS, on window.PT).
   Mirrors the domain in src/model/ and src/dsp/: string tunings, note math,
   row-median deltas. No real audio — readings are simulated for the demo. */
(function () {
  const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  // Common tunings, stored LOW string -> HIGH string (= grid columns S(n)..S1, left to right).
  const TUNINGS = {
    4:  [["E",1],["A",1],["D",2],["G",2]],
    5:  [["B",0],["E",1],["A",1],["D",2],["G",2]],
    6:  [["E",2],["A",2],["D",3],["G",3],["B",3],["E",4]],
    7:  [["B",1],["E",2],["A",2],["D",3],["G",3],["B",3],["E",4]],
    8:  [["F#",1],["B",1],["E",2],["A",2],["D",3],["G",3],["B",3],["E",4]],
  };

  function semitoneIndex(name, octave) {
    return octave * 12 + NOTE_NAMES.indexOf(name);
  }
  // Build a chromatic fallback rising from E2 for unusual string counts.
  function tuningFor(strings) {
    if (TUNINGS[strings]) return TUNINGS[strings].map(([n, o]) => ({ name: n, octave: o }));
    const out = [];
    let idx = semitoneIndex("E", 2);
    for (let i = 0; i < strings; i++) {
      out.push({ name: NOTE_NAMES[((idx % 12) + 12) % 12], octave: Math.floor(idx / 12) });
      idx += 5; // stack in fourths
    }
    return out;
  }

  function noteFreq(name, octave, a4 = 440) {
    const n = semitoneIndex(name, octave) - semitoneIndex("A", 4);
    return a4 * Math.pow(2, n / 12);
  }

  function median(values) {
    if (!values.length) return null;
    const s = [...values].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  }

  // delta of each captured cell vs the median of its pickup row (per metric).
  function rowMedian(row, metric) {
    return median(row.filter(Boolean).map((c) => c[metric]));
  }

  window.PT = { NOTE_NAMES, tuningFor, noteFreq, median, rowMedian };
})();
