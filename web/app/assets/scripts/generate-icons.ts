// import promises api and path from fs module
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ICONS_DR = path.resolve('app/assets/icons');
const OUTPUT_FILE = path.resolve('app/assets/scripts/generated-icons.ts');

/*
  remove .svg extension of file name, split name with hyphens + underscores into word parts,
  capitalise the first letter of each word part and join them back together to form
  PascalCase name (smiley-face.svg -> SmileyFace)
*/
function toPascalCase(filename: string): string {
  return filename
    .replace(/\.svg$/, '')
    .split(/[-_]/)
    .map((wordPart) => wordPart.charAt(0).toUpperCase() + wordPart.slice(1))
    .join('');
}

async function generateIcons(): Promise<void> {
  // read the contents of the icons directory, filter the output array of strings for .svg files, and sort them alphabetically
  const files = (await fs.readdir(ICONS_DR))
    .filter((file) => file.endsWith('.svg'))
    .sort((string1, string2) => string1.localeCompare(string2));

  // generate import statements for each icon file
  const imports = files
    .map((file) => {
      const iconName = toPascalCase(file);
      return `import ${iconName} from '../icons/${file}';`;
    })
    .join('\n');

  // generate mapping of icon names to their corresponding components
  const map = files
    .map((file) => {
      const key = file.replace(/\.svg$/, '');
      const componentName = toPascalCase(file);
      return `  '${key}': ${componentName},`; // e.g. 'smiley-face': SmileyFace,
    })
    .join('\n');

  // create output string (content) for generated-icons.ts file
  const output = `// AUTO-GENERATED FILE, DO NOT MODIFY !!!

${imports}

export const icons = {
  ${map}
} as const;
`;

  // write the output string to the generated-icons.ts file and log number of icons generated
  await fs.writeFile(OUTPUT_FILE, output);
  console.log(`${String(files.length)} icons generated!`);
}

try {
  await generateIcons();
} catch (error) {
  console.error(error);
  process.exit(1);
}
