import { getTemplateHtml } from "./deps.ts";

import { getSuccessCriteriaData } from "./adaptWcagData.ts";
import { createEmailInfoGenerator, IEmailInfo } from "./generateEmailInfo.ts";
import {
  createDirectory,
  writeHtmlToFile,
  writePlainTextToFile,
  writeJsObjToFile,
} from "./saveFiles.ts";

async function createEmailsFromTemplate(outputPath: string) {
  const successCriteriaData = await getSuccessCriteriaData();
  const templateHtml = await getTemplateHtml();

  const emailInfoGenerator = createEmailInfoGenerator(
    successCriteriaData,
    templateHtml,
  );

  await __writeEmailInfoToFiles(outputPath, emailInfoGenerator);
}

async function __writeEmailInfoToFiles(
  outputPath: string,
  emailInfoGenerator: Generator<IEmailInfo>,
) {
  await createDirectory(outputPath);

  const emailSpecificMetadata = [];

  for (const { id, html, text, subject } of emailInfoGenerator) {
    const htmlFilename = await writeHtmlToFile(
      outputPath,
      { name: id, content: html },
    );
    const plainTextFilename = await writePlainTextToFile(
      outputPath,
      { name: id, content: text },
    );

    emailSpecificMetadata.push({
      filename: htmlFilename,
      filenames: {
        html: htmlFilename,
        plainText: plainTextFilename,
      },
      subject: subject,
    });
  }

  const emailMetadata = {
    emails: emailSpecificMetadata,
  };

  await writeJsObjToFile(
    outputPath,
    { name: "emailMetadata", obj: emailMetadata },
  );
}

export { createEmailsFromTemplate };
