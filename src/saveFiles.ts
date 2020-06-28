async function createDirectory(path: string) {
  try {
    await Deno.mkdir(path, { recursive: true });
  } catch (e) {
    console.log(`${path} already exists`);
  }
}

async function writeHtmlToFile(
  path: string,
  fileInfo: IHtmlInfo,
): Promise<string> {
  const { name, content } = fileInfo;

  const safeFilename = name.replace(/\./g, "-");
  const safeFilenameWithExt = `${safeFilename}.html`;

  await Deno.writeTextFile(`${path}${safeFilenameWithExt}`, content);

  return safeFilenameWithExt;
}

interface IHtmlInfo {
  name: string;
  content: string;
}

async function writeJsObjToFile(path: string, fileInfo: IJsonInfo) {
  const { name, obj } = fileInfo;

  const jsonToSave: string = JSON.stringify(obj, undefined, 4);
  await Deno.writeTextFile(`${path}${name}.json`, jsonToSave);
}

interface IJsonInfo {
  name: string;
  obj: any;
}

export { createDirectory, writeHtmlToFile, writeJsObjToFile };
