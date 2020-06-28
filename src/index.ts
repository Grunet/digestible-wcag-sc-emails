import { getTemplateHtml } from "./deps.ts";

import { getSuccessCriteriaData } from "./adaptWcagData.ts";
import { createEmailInfoGenerator } from "./generateEmailInfo.ts";
import { createDirectory, writeHtmlToFile } from "./saveFiles.ts";

async function createEmailsFromTemplate(outputPath: string) {
  const successCriteriaData = await getSuccessCriteriaData();
  const templateHtml = await getTemplateHtml();

  const emailInfoGenerator = createEmailInfoGenerator(
    successCriteriaData,
    templateHtml,
  );

  await createDirectory(outputPath);

  const filenames: string[] = [];

  for (const { id, html } of emailInfoGenerator) {
    const filename = await writeHtmlToFile(
      outputPath,
      { name: id, content: html },
    );

    filenames.push(filename);
  }

  const fileMetadata = {
    files: filenames.map((filename) => ({ name: filename })),
  };

  const fileMetadataToSave: string = JSON.stringify(fileMetadata, undefined, 4);
  Deno.writeTextFile(`${outputPath}fileListing.json`, fileMetadataToSave);
}

export { createEmailsFromTemplate };
