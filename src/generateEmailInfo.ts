import { IOverrideInfo, prepHtml } from "./deps.ts";

function* createEmailInfoGenerator(
  successCriteriaData: any[],
  templateHtml: string,
): Generator<IEmailInfo> {
  for (const obj of successCriteriaData) {
    const overrideInfo: IOverrideInfo = {
      "content": {
        "email-preview-text": `${obj.id} - ${obj.name}`,
        "header": obj.guidelineInfo.name,
        "section-header": `${obj.name} (${obj.level})`,
        "main-text": obj.contentMarkup,
        "contextual-text": obj.guidelineInfo.paraText,
      },
      "links": {
        "more-info": obj.links.understand,
        "techniques": obj.links.meet,
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
