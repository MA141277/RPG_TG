import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { PNG } from 'pngjs';

const ROOT = process.cwd();
const DEFAULT_DIR = path.join(ROOT, 'src', 'faxian', 'leg');
const DEFAULT_REFERENCE = path.join(DEFAULT_DIR, '\u7d20\u6750.png');

const PARTS = [
  { id: 'head', label: 'head', file: 'head.png', targetWidth: 283, targetHeight: 265 },
  { id: 'torso', label: 'torso', file: 'torso.png', targetWidth: 345, targetHeight: 609 },
  { id: 'rightArm', label: 'rightArm', file: 'rightarm.png', targetWidth: 217, targetHeight: 488 },
  { id: 'leftArm', label: 'leftArm', file: 'leftarm.png', targetWidth: 214, targetHeight: 506 },
  { id: 'rightLeg', label: 'rightLeg', file: 'rightleg (1).png', targetWidth: 236, targetHeight: 511 },
  { id: 'leftLeg', label: 'leftLeg', file: 'leftleg.png', targetWidth: 243, targetHeight: 468 },
  { id: 'sword', label: 'sword', file: 'sword.png', targetWidth: 104, targetHeight: 637 },
];

const OPTIONS = {
  backgroundTolerance: 45,
  minPixels: 1000,
  padding: 2,
};

function log(message) {
  process.stdout.write(`${message}\n`);
}

function logError(message) {
  process.stderr.write(`${message}\n`);
}

function parseArgs(argv) {
  const args = {
    input: '',
    reference: DEFAULT_REFERENCE,
    outDir: DEFAULT_DIR,
    write: false,
    backup: true,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === '--write') {
      args.write = true;
    } else if (value === '--no-backup') {
      args.backup = false;
    } else if (value === '--reference') {
      args.reference = path.resolve(argv[++i] || '');
    } else if (value === '--out-dir') {
      args.outDir = path.resolve(argv[++i] || '');
    } else if (!args.input) {
      args.input = path.resolve(value);
    } else {
      throw new Error(`Unknown argument: ${value}`);
    }
  }

  if (!args.input) {
    throw new Error('Usage: node tools/replace-faxian-spine-pieces.mjs <input.png> [--write] [--out-dir <dir>] [--reference <\\u7d20\\u6750.png>]');
  }

  return args;
}

function readPng(filePath) {
  return PNG.sync.read(fs.readFileSync(filePath));
}

function writePng(filePath, png) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, PNG.sync.write(png));
}

function pixelOffset(png, x, y) {
  return (y * png.width + x) * 4;
}

function estimateBackground(png) {
  const samples = [];
  const edge = Math.min(24, png.width, png.height);

  for (let y = 0; y < edge; y += 1) {
    for (let x = 0; x < edge; x += 1) {
      const points = [
        [x, y],
        [png.width - 1 - x, y],
        [x, png.height - 1 - y],
        [png.width - 1 - x, png.height - 1 - y],
      ];
      for (const [px, py] of points) {
        const offset = pixelOffset(png, px, py);
        samples.push([png.data[offset], png.data[offset + 1], png.data[offset + 2]]);
      }
    }
  }

  const channels = [0, 1, 2].map((channel) => {
    const sorted = samples.map((sample) => sample[channel]).sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)] || 255;
  });

  return { r: channels[0], g: channels[1], b: channels[2] };
}

function colorDistance(a, r, g, b) {
  const dr = r - a.r;
  const dg = g - a.g;
  const db = b - a.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function createForegroundMask(png) {
  const { width, height, data } = png;
  const background = estimateBackground(png);
  const count = width * height;
  const edgeBackground = new Uint8Array(count);
  const queue = [];
  let cursor = 0;

  function isBackground(index) {
    const offset = index * 4;
    const alpha = data[offset + 3];
    if (alpha < 8) return true;

    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];

    return (
      colorDistance(background, r, g, b) <= OPTIONS.backgroundTolerance ||
      (r >= 235 && g >= 232 && b >= 228)
    );
  }

  function push(index) {
    if (edgeBackground[index]) return;
    edgeBackground[index] = 1;
    queue.push(index);
  }

  for (let x = 0; x < width; x += 1) {
    const top = x;
    const bottom = (height - 1) * width + x;
    if (isBackground(top)) push(top);
    if (isBackground(bottom)) push(bottom);
  }

  for (let y = 0; y < height; y += 1) {
    const left = y * width;
    const right = y * width + width - 1;
    if (isBackground(left)) push(left);
    if (isBackground(right)) push(right);
  }

  while (cursor < queue.length) {
    const index = queue[cursor++];
    const x = index % width;
    const y = Math.floor(index / width);
    const next = [];
    if (x > 0) next.push(index - 1);
    if (x < width - 1) next.push(index + 1);
    if (y > 0) next.push(index - width);
    if (y < height - 1) next.push(index + width);

    for (const neighbor of next) {
      if (!edgeBackground[neighbor] && isBackground(neighbor)) {
        push(neighbor);
      }
    }
  }

  const foreground = new Uint8Array(count);
  for (let index = 0; index < count; index += 1) {
    foreground[index] = edgeBackground[index] || data[index * 4 + 3] < 8 ? 0 : 1;
  }

  return foreground;
}

function detectComponents(png) {
  const { width, height } = png;
  const foreground = createForegroundMask(png);
  const seen = new Uint8Array(width * height);
  const components = [];

  for (let index = 0; index < foreground.length; index += 1) {
    if (!foreground[index] || seen[index]) continue;

    const stack = [index];
    seen[index] = 1;

    let pixels = 0;
    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;

    for (let cursor = 0; cursor < stack.length; cursor += 1) {
      const current = stack[cursor];
      const x = current % width;
      const y = Math.floor(current / width);

      pixels += 1;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);

      const next = [];
      if (x > 0) next.push(current - 1);
      if (x < width - 1) next.push(current + 1);
      if (y > 0) next.push(current - width);
      if (y < height - 1) next.push(current + width);

      for (const neighbor of next) {
        if (foreground[neighbor] && !seen[neighbor]) {
          seen[neighbor] = 1;
          stack.push(neighbor);
        }
      }
    }

    if (pixels >= OPTIONS.minPixels) {
      components.push({
        pixels,
        minX,
        minY,
        maxX,
        maxY,
        width: maxX - minX + 1,
        height: maxY - minY + 1,
        cx: (minX + maxX + 1) / 2,
        cy: (minY + maxY + 1) / 2,
      });
    }
  }

  return components.sort((a, b) => b.pixels - a.pixels);
}

function matchReferenceSlots(referencePng, referenceComponents) {
  const slots = [];
  const used = new Set();

  for (const part of PARTS) {
    let best = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (const component of referenceComponents) {
      if (used.has(component)) continue;
      const widthRatio = Math.abs(component.width - part.targetWidth) / Math.max(part.targetWidth, 1);
      const heightRatio = Math.abs(component.height - part.targetHeight) / Math.max(part.targetHeight, 1);
      const score = widthRatio + heightRatio;

      if (score < bestScore) {
        best = component;
        bestScore = score;
      }
    }

    if (!best) {
      throw new Error(`Could not find reference slot for ${part.id}`);
    }

    used.add(best);
    slots.push({
      ...part,
      reference: best,
      referenceImageSize: {
        width: referencePng.width,
        height: referencePng.height,
      },
      normalizedCenter: {
        x: best.cx / referencePng.width,
        y: best.cy / referencePng.height,
      },
    });
  }

  return slots;
}

function matchInputComponents(inputPng, inputComponents, slots) {
  const matches = [];
  const scaleX = inputPng.width / slots[0].referenceImageSize.width;
  const scaleY = inputPng.height / slots[0].referenceImageSize.height;

  for (const slot of slots) {
    const expected = {
      minX: Math.round(slot.reference.minX * scaleX),
      minY: Math.round(slot.reference.minY * scaleY),
      maxX: Math.round(slot.reference.maxX * scaleX),
      maxY: Math.round(slot.reference.maxY * scaleY),
    };
    expected.width = expected.maxX - expected.minX + 1;
    expected.height = expected.maxY - expected.minY + 1;
    expected.cx = (expected.minX + expected.maxX + 1) / 2;
    expected.cy = (expected.minY + expected.maxY + 1) / 2;

    let best = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (const component of inputComponents) {
      const cx = component.cx / inputPng.width;
      const cy = component.cy / inputPng.height;
      const dx = cx - slot.normalizedCenter.x;
      const dy = cy - slot.normalizedCenter.y;
      const positionScore = Math.sqrt(dx * dx + dy * dy) * 10;
      const sizeScore =
        Math.abs(component.width / inputPng.width - expected.width / inputPng.width) +
        Math.abs(component.height / inputPng.height - expected.height / inputPng.height);
      const score = positionScore + sizeScore;

      if (score < bestScore) {
        best = component;
        bestScore = score;
      }
    }

    if (!best) {
      throw new Error(`Could not find input component for ${slot.id}`);
    }

    const tooWide = best.width > expected.width * 1.35;
    const tooTall = best.height > expected.height * 1.35;
    const tooFar =
      Math.abs(best.cx - expected.cx) > expected.width * 0.9 ||
      Math.abs(best.cy - expected.cy) > expected.height * 0.9;
    const useExpectedSlot = tooWide || tooTall || tooFar;

    matches.push({
      slot,
      component: useExpectedSlot ? expected : best,
      mode: useExpectedSlot ? 'slot-crop' : 'component',
      score: bestScore,
    });
  }

  return matches;
}

function extractTransparentPiece(source, component, padding) {
  const minX = Math.max(0, component.minX - padding);
  const minY = Math.max(0, component.minY - padding);
  const maxX = Math.min(source.width - 1, component.maxX + padding);
  const maxY = Math.min(source.height - 1, component.maxY + padding);
  const output = new PNG({ width: maxX - minX + 1, height: maxY - minY + 1 });
  const foreground = createForegroundMask(source);

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const sourceIndex = y * source.width + x;
      const outputIndex = (y - minY) * output.width + (x - minX);
      const sourceOffset = sourceIndex * 4;
      const outputOffset = outputIndex * 4;

      if (!foreground[sourceIndex]) {
        output.data[outputOffset] = 0;
        output.data[outputOffset + 1] = 0;
        output.data[outputOffset + 2] = 0;
        output.data[outputOffset + 3] = 0;
        continue;
      }

      output.data[outputOffset] = source.data[sourceOffset];
      output.data[outputOffset + 1] = source.data[sourceOffset + 1];
      output.data[outputOffset + 2] = source.data[sourceOffset + 2];
      output.data[outputOffset + 3] = source.data[sourceOffset + 3];
    }
  }

  return output;
}

function normalizePieceSize(piece, width, height, padding) {
  if (piece.width === width && piece.height === height) return piece;

  const output = new PNG({ width, height });
  const drawWidth = Math.max(1, width - padding * 2);
  const drawHeight = Math.max(1, height - padding * 2);

  for (let y = 0; y < drawHeight; y += 1) {
    const sourceY = Math.min(piece.height - 1, Math.floor((y / drawHeight) * piece.height));
    for (let x = 0; x < drawWidth; x += 1) {
      const sourceX = Math.min(piece.width - 1, Math.floor((x / drawWidth) * piece.width));
      const sourceOffset = (sourceY * piece.width + sourceX) * 4;
      const outputOffset = ((y + padding) * width + (x + padding)) * 4;
      output.data[outputOffset] = piece.data[sourceOffset];
      output.data[outputOffset + 1] = piece.data[sourceOffset + 1];
      output.data[outputOffset + 2] = piece.data[sourceOffset + 2];
      output.data[outputOffset + 3] = piece.data[sourceOffset + 3];
    }
  }

  return output;
}

function backupFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+$/, '').replace('T', '-');
  fs.copyFileSync(filePath, `${filePath}.bak-${stamp}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPng = readPng(args.input);
  const referencePng = readPng(args.reference);
  const referenceComponents = detectComponents(referencePng);
  const inputComponents = detectComponents(inputPng);

  const slots = matchReferenceSlots(referencePng, referenceComponents);
  const matches = matchInputComponents(inputPng, inputComponents, slots);

  log(`Reference components: ${referenceComponents.length}`);
  log(`Input components: ${inputComponents.length}`);
  log(args.write ? `Writing pieces to ${args.outDir}` : 'Dry run only. Add --write to replace files.');

  for (const { slot, component, mode, score } of matches) {
    const extracted = extractTransparentPiece(inputPng, component, OPTIONS.padding);
    const output = normalizePieceSize(extracted, slot.targetWidth, slot.targetHeight, OPTIONS.padding);
    const outputPath = path.join(args.outDir, slot.file);
    const message = `${slot.label.padEnd(8)} -> ${slot.file.padEnd(18)} mode=${mode.padEnd(9)} bbox=${component.minX},${component.minY},${component.width}x${component.height} extracted=${extracted.width}x${extracted.height} output=${output.width}x${output.height} score=${score.toFixed(3)}`;

    log(message);

    if (args.write) {
      if (args.backup) backupFile(outputPath);
      writePng(outputPath, output);
    }
  }
}

try {
  main();
} catch (error) {
  logError(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
