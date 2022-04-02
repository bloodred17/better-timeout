import { readFile, writeFile, copyFile } from 'fs/promises';

(async () => {
  const packageJson = await readFile('./package.json', { flag: 'r+', encoding: 'utf-8' });
  const packageObj = JSON.parse(packageJson);

  const libraryJson = await readFile('./library.json', { flag: 'r+', encoding: 'utf-8' });
  const libraryObj = JSON.parse(libraryJson);

  const libraryPackageObj = { ...packageObj, ...libraryObj };
  const deleteList = [
    'type',
    'scripts',
    'dependencies',
    'devDependencies',
    'volta',
  ];
  for (const property in libraryPackageObj) {
    if (deleteList.includes(property)) {
      delete libraryPackageObj[property];
    }
  }

  await writeFile(
    './dist/simple-timeout/package.json',
    JSON.stringify(libraryPackageObj, undefined, 2),
    { flag: 'w+' }
  );
  // await copyFile('./LICENSE', './dist/simple-timeout/LICENSE');
  await copyFile('./LICENSE', './dist/simple-timeout/README.md');
})()
