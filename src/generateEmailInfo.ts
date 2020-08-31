import { IOverrideInfo, prepHtml } from "./deps.ts";

function* createEmailInfoGenerator(
  successCriteriaData: any[],
  templateHtml: string,
): Generator<IEmailInfo> {
  for (const obj of successCriteriaData) {
    const contentAsPlainText = prepHtml(obj.contentMarkup).getHtmlAsPlainText();

    const overrideInfo: IOverrideInfo = {
      "content": {
        "email-preview-text": contentAsPlainText,
        "header": obj.guidelineInfo.name,
        "section-header": obj.name,
        "section-header-subheading": `Level ${obj.level}`,
        "main-content": obj.contentMarkup,
        "contextual-text": obj.guidelineInfo.paraText,
        "example-content": obj.examples[0]?.content ??
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

interface IEmailInfo {
  id: string;
  html: string;
  subject: string;
}

export { createEmailInfoGenerator, IEmailInfo };
