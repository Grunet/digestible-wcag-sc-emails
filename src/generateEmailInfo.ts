import { IOverrideInfo, prepHtml, deepCopyObj } from "./deps.ts";
import { getReadingLevel } from "./readingLevelAdapter.ts";

interface IEmailInfo {
  id: string;
  html: string;
  text: string;
  subject: string;
}

function* createEmailInfoGenerator(
  successCriteriaData: any[],
  templateHtml: string,
): Generator<IEmailInfo> {
  for (const obj of successCriteriaData) {
    const htmlOverrideInfo: IOverrideInfo = __getOverrideInfo(obj);

    const successCritHtml = __applyOverrides(templateHtml, htmlOverrideInfo)
      .getHtmlAsString();

    const plainTextOverrideInfo: IOverrideInfo = deepCopyObj(htmlOverrideInfo);
    plainTextOverrideInfo["content"]["email-preview-text"] = "";

    const successCritPlainText = __applyOverrides(
      templateHtml,
      plainTextOverrideInfo,
    )
      .getHtmlAsPlainText();

    yield {
      id: obj.id,
      html: successCritHtml,
      text: successCritPlainText,
      subject: `${obj.name} - ${obj.id}`,
    };
  }
}

function __getOverrideInfo(obj: any): IOverrideInfo {
  const contentAsPlainText = prepHtml(obj.contentMarkup).getHtmlAsPlainText();
  const mostReadableExample = __getMostReadableExample(obj.examples);

  const overrideInfo: IOverrideInfo = {
    "content": {
      "email-preview-text": contentAsPlainText,
      "header": obj.guidelineInfo.name,
      "section-header": obj.name,
      "section-header-subheading": `Level ${obj.level}`,
      "main-content": obj.contentMarkup,
      "contextual-text": obj.guidelineInfo.paraText,
      "example-content": mostReadableExample?.content ??
        `<p>My bot couldn't find any &#128546;. But the linked pages might still have ones it missed.</p>`,
    },
    "links": {
      "more-info": obj.links.examples,
    },
  };

  return overrideInfo;
}

function __getMostReadableExample(
  examples: { content: string }[],
): { content: string } | undefined {
  const examplesContentAsPlainText = examples.map(function ({ content }) {
    return prepHtml(content).getHtmlAsPlainText();
  });

  const indexOfMostReadableExample = __findIndexOfMostReadableOption(
    examplesContentAsPlainText,
  );

  return examples[indexOfMostReadableExample];
}

function __findIndexOfMostReadableOption(options: string[]): number {
  const readingLevels = options.map((optionText) =>
    getReadingLevel({ text: optionText })
  );

  return readingLevels.indexOf(Math.min(...readingLevels));
}

function __applyOverrides(templateHtml: string, overrideInfo: IOverrideInfo) {
  const adaptedOverrideInfo = __adaptOverrideInfo(overrideInfo);

  return prepHtml(templateHtml)
    .overwriteSlots({
      overrides: adaptedOverrideInfo["content"],
    })
    .overwriteAttributes({
      overrides: adaptedOverrideInfo["links"],
    });
}

function __adaptOverrideInfo(overrideInfo: IOverrideInfo) {
  const overrideInfoDeepClone = deepCopyObj(overrideInfo);

  return {
    "content": overrideInfoDeepClone["content"],
    "links": Object.fromEntries(
      Object.entries(overrideInfoDeepClone["links"]).map((
        [k, v],
      ) => [k, { "href": v }]),
    ),
  };
}

export { createEmailInfoGenerator, IEmailInfo };
