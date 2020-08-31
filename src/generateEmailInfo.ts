import { IOverrideInfo, prepHtml } from "./deps.ts";
import { getReadingLevel } from "./readingLevelAdapter.ts";

interface IEmailInfo {
  id: string;
  html: string;
  subject: string;
}

function* createEmailInfoGenerator(
  successCriteriaData: any[],
  templateHtml: string,
): Generator<IEmailInfo> {
  for (const obj of successCriteriaData) {
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

    const adaptedOverrideInfo = {
      "content": overrideInfo["content"],
      "links": Object.fromEntries(
        Object.entries(overrideInfo["links"]).map((
          [k, v],
        ) => [k, { "href": v }]),
      ),
    };

    const successCritHtml = prepHtml(templateHtml)
      .overwriteSlots({
        overrides: adaptedOverrideInfo["content"],
      }).overwriteAttributes({
        overrides: adaptedOverrideInfo["links"],
      })
      .getHtmlAsString();

    yield {
      id: obj.id,
      html: successCritHtml,
      subject: `${obj.name} - ${obj.id}`,
    };
  }
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

export { createEmailInfoGenerator, IEmailInfo };
