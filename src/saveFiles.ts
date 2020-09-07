async function createDirectory(path: string) {
  try {
    await Deno.mkdir(path, { recursive: true });
  } catch (e) {
    console.log(`${path} already exists`);
  }
}

interface IFileInfo {
  name: string;
  content: string;
}

async function writeHtmlToFile(
  path: string,
  fileInfo: IFileInfo,
): Promise<string> {
  return __writeTextFile(path, { ...fileInfo, extension: "html" });
}

async function writePlainTextToFile(
  path: string,
  fileInfo: IFileInfo,
): Promise<string> {
  return __writeTextFile(path, { ...fileInfo, extension: "txt" });
}

interface IExtendedFileInfo extends IFileInfo {
  extension: string;
}

async function __writeTextFile(
  path: string,
  fileInfo: IExtendedFileInfo,
): Promise<string> {
  const { name, content, extension } = fileInfo;

  const safeFilename = name.replace(/\./g, "-");
  const safeFilenameWithExt = `${safeFilename}.${extension}`;

  await Deno.writeTextFile(`${path}${safeFilenameWithExt}`, content);

  return safeFilenameWithExt;
}

interface IJsonInfo {
  name: string;
  obj: any;
}

async function writeJsObjToFile(path: string, fileInfo: IJsonInfo) {
  const { name, obj } = fileInfo;

  const jsonToSave: string = JSON.stringify(obj, undefined, 4);
  await Deno.writeTextFile(`${path}${name}.json`, jsonToSave);
}

export {
  createDirectory,
  writeHtmlToFile,
  writePlainTextToFile,
  writeJsObjToFile,
};
