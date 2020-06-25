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

  for (const emailInfo of emailInfoGenerator) {
    const { id, html } = emailInfo;

    await writeHtmlToFile(outputPath, { filename: id, content: html });
  }
}

export { createEmailsFromTemplate };
