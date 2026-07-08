// import promises api and path from fs module
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ICONS_DIR = path.resolve('app/assets/icons');

async function normaliseIcons(): Promise<void> {
  // read the contents of the icons directory, filter the output
  // array of strings for .svg files, and sort them alphabetically
  const files = (await fs.readdir(ICONS_DIR))
    .filter((file) => file.endsWith('.svg'))
    .sort((string1, string2) => string1.localeCompare(string2));

  // iterate over each .svg file, read its contents, and replace all
  // fills, strokes, and sizing attributes to make icons reusable
  for (const file of files) {
    const filePath = path.join(ICONS_DIR, file);

    let svg = await fs.readFile(filePath, 'utf8');
    const originalSvg = svg;

    // replace all fills except "none"
    svg = svg.replace(/fill="(?!none\b)[^"]*"/gi, 'fill="currentColor"');

    // replace all strokes except "none"
    svg = svg.replace(/stroke="(?!none\b)[^"]*"/gi, 'stroke="currentColor"');

    // remove fixed width values so React controls sizing
    svg = svg.replace(/\swidth="[^"]*"/gi, '');

    // remove fixed height values so React controls sizing
    svg = svg.replace(/\sheight="[^"]*"/gi, '');

    // remove inline style attributes that may contain fixed sizing/colours
    svg = svg.replace(/\sstyle="[^"]*"/gi, '');

    // if the svg has changed, write the new contents back to the file
    // otherwise, log that there were no changes
    if (svg !== originalSvg) {
      await fs.writeFile(filePath, svg, 'utf8');
      console.log(`updated! - ${file}`);
    } else {
      console.log(`no changes - ${file}`);
    }
  }

  console.log(`${String(files.length)} icons normalised!`);
}

try {
  await normaliseIcons();
} catch (error) {
  console.error(error);
  process.exit(1);
}
