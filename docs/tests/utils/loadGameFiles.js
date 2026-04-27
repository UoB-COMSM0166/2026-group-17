import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

// Map specific filenames to explicit global variable names when automatic detection is insufficient
const aliases = new Map([
  ['Impactgun.js', 'ImpactGun'],
  ['WEAPON_REGISTRY.js', 'WEAPON_REGISTRY'],
]);

// Recursively searches directories to locate a target file by name
function findFileRecursive(root, file) {
  if (!fs.existsSync(root)) return null;

  const entries = fs.readdirSync(root, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isFile() && entry.name === file) {
      return fullPath;
    }
    if (entry.isDirectory()) {
      const found = findFileRecursive(fullPath, file);
      if (found) return found;
    }
  }

  return null;
}

// Resolve file paths by searching multiple likely project directories
function resolveFile(file) {
  const possibleRoots = [];
  let current = process.cwd();
  for (let i = 0; i < 6; i += 1) {
    possibleRoots.push(path.join(current, 'js'));
    possibleRoots.push(path.join(current, 'docs', 'js'));
    possibleRoots.push(path.join(current, '..', 'js'));
    possibleRoots.push(path.join(current, '..', 'docs', 'js'));

    current = path.dirname(current);
  }

  for (const root of possibleRoots) {
    const found = findFileRecursive(path.resolve(root), file);
    if (found) return found;
  }

  throw new Error(
    `Cannot find ${file}. Please check whether it exists under docs/js or update tests/utils/loadGameFiles.js.`
  );
}

// Extracts the primary variable and class name from the file 
function exposedName(file, code) {
  if (aliases.has(file)) return aliases.get(file);

  const classMatch = code.match(/class\s+([A-Za-z_$][\w$]*)/);
  if (classMatch) return classMatch[1];

  const constMatch = code.match(/const\s+([A-Za-z_$][\w$]*)/);
  if (constMatch) return constMatch[1];

  const letMatch = code.match(/let\s+([A-Za-z_$][\w$]*)/);
  if (letMatch) return letMatch[1];

  const varMatch = code.match(/var\s+([A-Za-z_$][\w$]*)/);
  if (varMatch) return varMatch[1];

  return null;
}

// Evaluates each file in a VM context and attaches detected symbols to globalThis for test access
export function loadGameFiles(files) {
  for (const file of files) {
    const filename = resolveFile(file);
    const code = fs.readFileSync(filename, 'utf8');
    const name = exposedName(file, code);
    const footer = name
      ? `\n;globalThis.${name} = typeof ${name} !== 'undefined' ? ${name} : globalThis.${name};`
      : '';

    vm.runInThisContext(`${code}${footer}`, { filename });
  }
}