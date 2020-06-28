async function createDirectory(path: string) {
  try {
    await Deno.mkdir(path, { recursive: true });
  } catch (e) {
    console.log(`${path} already exists`);
  }
}

async function writeHtmlToFile(
  path: string,
  fileInfo: IFileInfo,
): Promise<string> {
  const { name, content } = fileInfo;

  const safeFilename = name.replace(/\./g, "-");
  const safeFilenameWithExt = `${safeFilename}.html`;

  await Deno.writeTextFile(`${path}${safeFilenameWithExt}`, content);

  return safeFilenameWithExt;
}

interface IFileInfo {
  name: string;
  content: string;
}

export { createDirectory, writeHtmlToFile, IFileInfo };
