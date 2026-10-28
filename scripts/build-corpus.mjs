// Builds src/data/corpus/*.json from the Project Madurai source files in sources/projectmadurai.
// Project Madurai texts are freely distributable with their header intact; the raw files are kept unchanged.
//
//   node scripts/build-corpus.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC = path.join(ROOT, "sources/projectmadurai");
const OUT = path.join(ROOT, "src/data/corpus");

// ---------------------------------------------------------------------------
// Work definitions. `start` is a regex matched against trimmed lines; segments
// in the same file run until the next segment's start (or `end`).
// `skip` = number of earlier matches to skip (tables of contents repeat headings).
// ---------------------------------------------------------------------------
const WORKS = [
  // Thirumoolar
  {
    id: "thirumanthiram", siddhar: "thirumoolar", titleTa: "திருமந்திரம்", titleEn: "Thirumanthiram",
    form: "நான்கடி கலிவிருத்தம்", mode: "tm",
    files: [
      { file: "0004", start: /^விநாயகர் காப்பு/ },
      { file: "0009_01" }, { file: "0009_02" }, { file: "0009_03" },
      { file: "0010_01" }, { file: "0010_02" }, { file: "0010_03" },
    ],
  },
  { id: "thirumoolar-gnanam", siddhar: "thirumoolar", titleTa: "திருமூல நாயனார் ஞானம்", titleEn: "Thirumoola Nayanar Gnanam", file: "0076", start: /^6\. திருமூல நாயனார் ஞானம்/, skip: 1 },

  // Agathiyar & early tradition
  { id: "agathiyar-gnanam", siddhar: "agathiyar", titleTa: "அகஸ்தியர் ஞானம்", titleEn: "Agathiyar Gnanam", file: "0859", start: /^2\. அகஸ்தியர் ஞானம்/ },
  { id: "subramaniar-gnanam", siddhar: "subramaniar", titleTa: "சுப்பிரமணியர் ஞானம்", titleEn: "Subramaniar Gnanam", file: "0859", start: /^சுப்பிரமணியர் ஞானம்\s*$/ },
  { id: "kakabhusundar-gnanam", siddhar: "kakabhusundar", titleTa: "காகபுசுண்டர் ஞானம்", titleEn: "Kakabhusundar Gnanam", file: "0859", start: /^1\. காகபுசுண்டர் ஞானம்/ },
  { id: "romarishi-gnanam", siddhar: "romarishi", titleTa: "உரோம ரிஷி ஞானம்", titleEn: "Romarishi Gnanam", file: "0859", start: /^3\. உரோம ரிஷி ஞானம்/ },
  { id: "valmiki-gnanam", siddhar: "valmiki", titleTa: "வால்மீகர் சூத்திர ஞானம்", titleEn: "Valmikar Soothira Gnanam", file: "0859", start: /^4 \. வால்மீகர் சூத்திர ஞானம்/ },
  { id: "thiruvalluvar-gnanam", siddhar: "thiruvalluvar", titleTa: "திருவள்ளுவர் ஞானம்", titleEn: "Thiruvalluvar Gnanam", file: "0076", start: /^7\. திருவள்ளுவர் ஞானம்/, skip: 1 },
  { id: "konganar-padalgal", siddhar: "konganar", titleTa: "கொங்கணச் சித்தர் பாடல்கள்", titleEn: "Konganar Songs", file: "0212", start: /^3\. கொங்கணச் சித்தர் பாடல்கள்/ },

  // Sivavakkiyar
  { id: "sivavakkiyam", siddhar: "sivavakkiyar", titleTa: "சிவவாக்கியம்", titleEn: "Sivavakkiyam", file: "0269", start: /^காப்பு$/ },

  // Pattinathar (Thirumurai 11 works + siddhar songs)
  { id: "thiruvidaimaruthur-mummanikkovai", siddhar: "pattinathar", titleTa: "திருவிடைமருதூர் மும்மணிக்கோவை", titleEn: "Thiruvidaimaruthur Mummanikkovai", file: "0270", start: /^1\. திருவிடைமருதூர் மும்மணிக்கோவை/ },
  { id: "thirukkazhumala-mummanikkovai", siddhar: "pattinathar", titleTa: "திருக்கழுமல மும்மணிக்கோவை", titleEn: "Thirukkazhumala Mummanikkovai", file: "0270", start: /^2\. திருக்கழுமல மும்மணிக்கோவை/ },
  { id: "thiruvekambamudaiyar-thiruvanthathi", siddhar: "pattinathar", titleTa: "திருவேகம்பமுடையார் திருவந்தாதி", titleEn: "Thiruvekambamudaiyar Thiruvanthathi", file: "0270", start: /^3\. திருவேகம்பமுடையார் திருவந்தாதி/ },
  { id: "thiruvotriyur-thogai", siddhar: "pattinathar", titleTa: "திருவொற்றியூர்த் தொகை", titleEn: "Thiruvotriyur Thogai", file: "0270", start: /^4 திருவொற்றியூர்த்தொகை/ },
  { id: "thiruvekambamalai", siddhar: "pattinathar", titleTa: "திருவேகம்பமாலை", titleEn: "Thiruvekambamalai", file: "0083", start: /^1\. திருவேகம்பமாலை/, skip: 1 },
  { id: "thiruthillai", siddhar: "pattinathar", titleTa: "திருத்தில்லை", titleEn: "Thiruthillai", file: "0083", start: /^2\. திருத்தில்லை/, skip: 1 },
  { id: "koyil-thiruvagaval", siddhar: "pattinathar", titleTa: "கோயில் திருவகவல் (1–3)", titleEn: "Koyil Thiruvagaval (1–3)", file: "0083", start: /^3\. முதலாவது கோயிற்றிருவகவல்/, skip: 1, end: /^6\. நான்காவது கச்சித்/ },
  { id: "kachi-thiruvagaval", siddhar: "pattinathar", titleTa: "கச்சித் திருவகவல் & தனிப்பாடல்கள்", titleEn: "Kachi Thiruvagaval & Other Songs", file: "0083", start: /^6\. நான்காவது கச்சித்/, skip: 1, end: /^7\. அருட்புலம்பல்/ },
  { id: "thiruppadal-thirattu", siddhar: "pattinathar", titleTa: "திருப்பாடற்றிரட்டு", titleEn: "Thiruppadal Thirattu", file: "0270", start: /^5\. திருப்பாடற்றிரட்டு/ },
  { id: "arutpulambal", siddhar: "pattinathar", titleTa: "அருட்புலம்பல்", titleEn: "Arutpulambal", file: "0276_01", start: /^அருட்புலம்பல் - முதல்வன் முறையீடு/, end: /^திருப்பாடற்றிரட்டு \/அருட்புலம்பல் - 4/ },
  { id: "nenjodu-pulambal", siddhar: "pattinathar", titleTa: "நெஞ்சொடு புலம்பல்", titleEn: "Nenjodu Pulambal", file: "0276_01", start: /^திருப்பாடற்றிரட்டு \/அருட்புலம்பல் - 4/ },
  { id: "poorana-malai", siddhar: "pattinathar", titleTa: "பூரணமாலை", titleEn: "Poorana Malai", file: "0276_02", start: /^பூரணமாலை\.$/ },
  { id: "nenjodu-magizhthal", siddhar: "pattinathar", titleTa: "நெஞ்சொடு மகிழ்தல்", titleEn: "Nenjodu Magizhthal", file: "0276_02", start: /^நெஞ்சொடுமகிழ்தல்\.$/ },
  { id: "udarkootru-vannam", siddhar: "pattinathar", titleTa: "உடற்கூற்று வண்ணம்", titleEn: "Udarkootru Vannam", file: "0276_02", start: /^உடற்கூற்றுவண்ணம்\.$/ },

  // Bhadragiriyar
  { id: "meignana-pulambal", siddhar: "bhadragiriyar", titleTa: "மெய்ஞ்ஞானப் புலம்பல்", titleEn: "Meignana Pulambal", file: "0074", start: /^காப்பு$/ },

  // Later siddhars (traditional order within the 10th–18th c. siddhar period)
  { id: "idaikkadar-padalgal", siddhar: "idaikkadar", titleTa: "இடைக்காட்டுச் சித்தர் பாடல்கள்", titleEn: "Idaikkadar Songs", file: "0212", start: /^2\. இடைக்காட்டுச் சித்தர் பாடல்கள்/ },
  { id: "machamuni-padal", siddhar: "machamuni", titleTa: "நொண்டிச் சித்தர் (மச்சேந்திர நாதர்) பாடல்", titleEn: "Nondi Siddhar (Machendranathar) Song", file: "0858", start: /^4\. மச்சேந்திர நாதர்/ },
  { id: "ramadevar-poojavidhi", siddhar: "ramadevar", titleTa: "இராமதேவர் பூஜாவிதி", titleEn: "Ramadevar Pooja Vidhi", file: "0076", start: /^2\. இராமதேவர் - பூஜாவிதி/, skip: 1 },
  { id: "sattaimuni-gnanam", siddhar: "sattaimuni", titleTa: "சட்டைமுனி ஞானம்", titleEn: "Sattaimuni Gnanam", file: "0076", start: /^5\. சட்டைமுனி ஞானம்/, skip: 1 },
  { id: "pambatti-padal", siddhar: "pambatti", titleTa: "பாம்பாட்டிச் சித்தர் பாடல்", titleEn: "Pambatti Siddhar Song", file: "0857", start: /^1\. பாம்பாட்டிச் சித்தர் பாடல்/ },
  { id: "agappei-padalgal", siddhar: "agappei", titleTa: "அகப்பேய்ச் சித்தர் பாடல்கள்", titleEn: "Agappei Siddhar Songs", file: "0212", start: /^அகப்பேய் சித்தர் பாடல்கள்$/ },
  { id: "kudhambai-padalgal", siddhar: "kudhambai", titleTa: "குதம்பைச் சித்தர் பாடல்கள்", titleEn: "Kudhambai Siddhar Songs", file: "0076", start: /^4\. குதம்பைச் சித்தர் பாடல்கள்/, skip: 1 },
  { id: "azhukani-padalgal", siddhar: "azhukani", titleTa: "அழுகணிச் சித்தர் பாடல்கள்", titleEn: "Azhukani Siddhar Songs", file: "0076", start: /^1\. அழுகணிச் சித்தர் பாடல்கள்/, skip: 1 },
  { id: "kaduveli-ananda-kalippu", siddhar: "kaduveli", titleTa: "கடுவெளிச் சித்தர் ஆனந்தக் களிப்பு", titleEn: "Kaduveli Siddhar – Ananda Kalippu", file: "0076", start: /^3\. கடுவெளிச் சித்தர் - ஆனந்தக் களிப்பு/, skip: 1 },
  { id: "mouna-siddhar-padal", siddhar: "mouna", titleTa: "மௌனச் சித்தர் (வகுளிநாதர்) பாடல்", titleEn: "Mouna Siddhar (Vakulinathar) Song", file: "0858", start: /^1\. வகுளிநாதரென்னும் மௌனச்சித்தர் பாடல்/ },
  { id: "punnakku-padal", siddhar: "punnakku", titleTa: "புண்ணாக்குச் சித்தர் பாடல்", titleEn: "Punnakku Siddhar Song", file: "0858", start: /^2\. புண்ணாக்குச் சித்தர் பாடல்/ },
  { id: "kanjamalai-padal", siddhar: "kanjamalai", titleTa: "கஞ்சமலைச் சித்தர் பாடல்", titleEn: "Kanjamalai Siddhar Song", file: "0858", start: /^3\. கஞ்சமலைச் சித்தர் பாடல்/ },
  { id: "sangili-padal", siddhar: "sangili", titleTa: "சங்கிலிச் சித்தர் பாடல்", titleEn: "Sangili Siddhar Song", file: "0857", start: /^2\. சங்கிலிச் சித்தர் பாடல்/ },
  { id: "thirikona-padal", siddhar: "thirikona", titleTa: "திரிகோணச் சித்தர் பாடல்", titleEn: "Thirikona Siddhar Song", file: "0857", start: /^3\. திரிகோணச் சித்தர் பாடல்/ },
  { id: "gnana-kummi", siddhar: "valaisami", titleTa: "ஞானக்கும்மி", titleEn: "Gnana Kummi", file: "0853_02", start: /^சிவமயம்,?$/ },
];

// ---------------------------------------------------------------------------
function htmlToLines(file) {
  let h = fs.readFileSync(path.join(SRC, `${file}.html`), "utf8").replace(/^﻿/, "");
  h = h.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "");
  h = h.replace(/<br\s*\/?>/gi, "\n").replace(/<\/?(p|div|tr|h\d|li|pre|table|td)[^>]*>/gi, "\n");
  h = h.replace(/<[^>]*>/g, "");
  h = h
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d));
  const lines = h.split("\n").map((l) => l.replace(/[\t  ]+/g, " ").trim());
  // drop the Project Madurai header block
  const hdr = lines.findIndex((l) => /header page is kept intact/i.test(l));
  return hdr >= 0 ? lines.slice(hdr + 1) : lines;
}

const NOISE = /^([^஀-௿]*[A-Za-z]{3,}.*|-{2,}.*|\(?முடிந்தது\)?|.*முற்றிற்று\.?|திருச்சிற்றம்பலம்\.?|உ|கணபதிதுணை\.?|சிவமயம்,?|Feel free to send.*|Source:?|\*+)$/;
const wordCount = (s) => s.split(/\s+/).filter(Boolean).length;
const isProse = (s) => wordCount(s) > 13 || /[a-zA-Z]{4,}/.test(s);
const SECTION_LINE = /^\(?\d{1,3}\)?\.{1,2}\s*\S/; // "1.. கடவுள் வாழ்த்து", "2. வேதச் சிறப்பு"
const TANTRA_HEAD = /^(பாயிரம்|\S+ தந்திரம்)(\s*\(|\s*$)/;
const HEADING_WORD = /(பா|விருத்தம்|கண்ணி(கள்)?|கும்மி|காப்பு|வணக்கம்|பல்லவி|துதி|நிலை|ஞானம்|சிந்து|தாழிசை|கீர்த்தனை|திருவிசைப்பா)\.?$/;
const isHeading = (l) =>
  !/[-–]\s*\S+\s*$/.test(l) && !/அகப்பேய்|குதம்பாய்|கண்ணம்மா/.test(l) &&
  ((SECTION_LINE.test(l) && wordCount(l) <= 4) || (wordCount(l) <= 3 && l.length <= 14) || (HEADING_WORD.test(l) && wordCount(l) <= 4 && l.length <= 32));
const GLOSS_LINE = /^(\d{1,3})\.\s+(.+?)\s+[-–]\s+(.+)$/;

function cleanLine(l) {
  return l.replace(/\.\(\d+\)\./g, "").replace(/\[\d+\]/g, "").replace(/\s+/g, " ").trim();
}

function sliceSegment(lines, def, nextStart) {
  let from = 0;
  if (def.start) {
    let seen = 0;
    from = -1;
    for (let i = 0; i < lines.length; i++) {
      if (def.start.test(lines[i])) {
        if (seen === (def.skip ?? 0)) { from = i; break; }
        seen++;
      }
    }
    if (from < 0) throw new Error(`start not found for ${def.id ?? def.file}: ${def.start}`);
  }
  let to = lines.length;
  const endRe = def.end ?? nextStart;
  if (endRe) {
    for (let i = from + 1; i < lines.length; i++) if (endRe.test(lines[i])) { to = i; break; }
  }
  return { body: lines.slice(from + 1, to), title: lines[from] };
}

// Most siddhar texts: each verse ends with its number on the last line.
function parseTrailing(body) {
  const verses = [];
  const gloss = {};
  const intro = [];
  let buf = [];
  let section;
  for (const raw of body) {
    let line = raw;
    if (!line || NOISE.test(line)) continue;
    const g = line.match(GLOSS_LINE);
    if (g && !/\d\s*$/.test(line)) {
      (gloss[+g[1]] ??= []).push(`${g[2]} – ${g[3]}`);
      continue;
    }
    const m = line.match(/^(.*?)[\s.]*?(\d{1,4})\s*\.?\s*$/);
    if (m && !/^\[/.test(line.trim()) || (m && /\]\s*\d+\s*$/.test(line))) {
      const text = m[1].trim();
      if (text) buf.push(text);
      if (!buf.length) continue;
      // separate bracketed notes and leading headings/prose
      const notes = [];
      let vl = [];
      for (let b of buf) {
        b = b.replace(/^\[\d+\](?=\S)/, "");
        const br = b.match(/^\[(.*)\]$/);
        if (br) notes.push(br[1]);
        else if (/^\[\d*\]?\s*\S/.test(b) && b.startsWith("[")) notes.push(b.replace(/^\[\d*\]\s*/, ""));
        else vl.push(cleanLine(b));
      }
      // prose (introductions) before the first verse lines
      let lastProse = -1;
      vl.forEach((l, i) => { if (isProse(l)) lastProse = i; });
      if (lastProse >= 0 && verses.length < 3) {
        intro.push(...vl.slice(0, lastProse + 1));
        vl = vl.slice(lastProse + 1);
      }
      // leading short heading lines (e.g. "காப்பு", "யோக நிலை", "கண்ணிகள்")
      while (vl.length > 2 && isHeading(vl[0])) {
        section = vl.shift().replace(/^\(?\d{1,3}\)?\.{1,2}\s*/, "").replace(/\.$/, "");
      }
      // a one-line block such as "ஞானம் - 1" is a section heading, not a verse
      if (vl.length === 1 && wordCount(vl[0]) <= 3) {
        section = `${vl[0].replace(/\s*[-–]\s*$/, "")} ${m[2]}`;
      } else if (vl.length) {
        verses.push({ label: m[2], section, lines: vl, ...(notes.length ? { notes } : {}) });
      }
      buf = [];
    } else {
      buf.push(line);
    }
  }
  for (const v of verses) {
    const gl = gloss[+v.label];
    if (gl) v.gloss = gl;
  }
  return { verses, intro };
}

// Thirumanthiram: a number-only marker line precedes each verse (forms "12.", ".549..", "1707").
function parseThirumanthiram(body, state) {
  const verses = [];
  let marker = null;
  let block = [];
  const flush = () => {
    const lines = [];
    const notes = [];
    const after = [];
    for (const l of block) {
      if (!l || NOISE.test(l)) continue;
      if (/^\.\(\d+\)\.\s*\S/.test(l) && lines.length >= 4) { notes.push(cleanLine(l)); continue; }
      if (lines.length < 4 && !SECTION_LINE.test(l) && !TANTRA_HEAD.test(l)) {
        lines.push(cleanLine(l).replace(/\s*\.?\s*\d{1,4}\s*$/, ""));
      } else after.push(l);
    }
    if (marker !== null && lines.length) {
      verses.push({ label: String(marker), section: state.section, lines, ...(notes.length ? { notes: notes.map((n) => `பாடபேதம்: ${n}`) } : {}) });
    } else if (marker === null && lines.length >= 3) {
      verses.push({ label: "காப்பு", section: "விநாயகர் காப்பு", lines });
    }
    for (const a of after) {
      if (/^\.\(\d+\)\./.test(a)) continue;
      if (SECTION_LINE.test(a) || TANTRA_HEAD.test(a) || wordCount(a) <= 5) {
        const s = cleanLine(a).replace(/^\.?\d{1,4}\.{1,2}\s*/, "").replace(/\.$/, "").trim();
        if (s && !/^\d+$/.test(s)) state.section = s;
      }
    }
    block = [];
  };
  for (const l of body) {
    const mk = l.match(/^\.?(\d{1,4})\.{0,2}$/);
    if (mk) { flush(); marker = +mk[1]; continue; }
    block.push(l);
  }
  flush();
  return verses;
}

// ---------------------------------------------------------------------------
fs.mkdirSync(OUT, { recursive: true });
const cache = new Map();
const linesOf = (f) => (cache.has(f) ? cache.get(f) : (cache.set(f, htmlToLines(f)), cache.get(f)));

const index = [];
for (const w of WORKS) {
  let verses = [];
  let intro = [];
  if (w.mode === "tm") {
    const state = { section: undefined };
    for (const part of w.files) {
      const { body } = sliceSegment(linesOf(part.file), part);
      verses.push(...parseThirumanthiram(body, state));
    }
  } else {
    const siblings = WORKS.filter((o) => o.file === w.file && o !== w);
    const lines = linesOf(w.file);
    const { body } = sliceSegment(lines, w, undefined);
    // stop at the earliest sibling start that follows this one
    let cut = body.length;
    for (const s of siblings) {
      for (let i = 0; i < body.length; i++) if (s.start.test(body[i]) && i < cut) {
        cut = i;
        break;
      }
    }
    const r = parseTrailing(body.slice(0, cut));
    verses = r.verses;
    intro = r.intro;
  }
  verses = verses.map((v, i) => ({ n: i + 1, ...v }));
  const data = {
    id: w.id, siddhar: w.siddhar, titleTa: w.titleTa, titleEn: w.titleEn,
    source: (w.files ?? [{ file: w.file }]).map((f) => `pm${f.file}`),
    ...(intro.length ? { intro: intro.join(" ") } : {}),
    verses,
  };
  fs.writeFileSync(path.join(OUT, `${w.id}.json`), JSON.stringify(data));
  index.push({ id: w.id, siddhar: w.siddhar, titleTa: w.titleTa, titleEn: w.titleEn, count: verses.length, source: data.source });
  console.log(`${w.id.padEnd(38)} ${String(verses.length).padStart(5)}`);
}
fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index, null, 1));
console.log("total verses:", index.reduce((a, b) => a + b.count, 0));
