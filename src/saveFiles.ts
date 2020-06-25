async function createDirectory(path: string) {
  try {
    await Deno.mkdir(path, { recursive: true });
  } catch (e) {
    console.log(`${path} already exists`);
  }
}

async function writeHtmlToFile(path: string, fileInfo: IFileInfo) {
  const { filename, content } = fileInfo;

  const safeFilename = filename.replace(/\./g, "-");

  await Deno.writeTextFile(`${path}${safeFilename}.html`, content);
}

interface IFileInfo {
  filename: string;
  content: string;
}

export { createDirectory, writeHtmlToFile, IFileInfo };
