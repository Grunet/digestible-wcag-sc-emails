import {
  getTemplateHtml,
  IOverrideInfo,
  prepHtml,
  getWcagData,
} from "./deps.ts";

// This should probably point to a pinned version of the typings
// @deno-types="https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/traverse/index.d.ts"
import traverse from "https://dev.jspm.io/traverse@0.6.6";

//TODO - wrap this in a function instead of having it be immediately invoked (invoke it via a script instead)
// deno run --allow-net --allow-write=../dist/ .\index.ts <- how to currently run this file

//TODO - break this up into at least 2 separate files (one for data prep and the other for the actual html generation)

const wcagData = await getWcagData();

const successCritData: any[] = [];

traverse(wcagData).forEach(function (
  this: traverse.TraverseContext,
  _value: any,
) {
  if (this?.key === "successCriteria") {
    const clonedSuccessCritData = (this.node as any[]).map((obj: any) =>
      JSON.parse(JSON.stringify(obj))
    );

    const additionalContext = {
      guidelineInfo: {
        name: this.parent?.node["name"],
        paraText: this.parent?.node["paraText"],
      },
    };

    clonedSuccessCritData.forEach((successCritDataObj: any) => {
      Object.assign(successCritDataObj, additionalContext);
    });

    successCritData.push(...clonedSuccessCritData);
  }
});

const templateHtml = await getTemplateHtml();

try {
  Deno.mkdir("../dist/");
} catch (e) {
  console.log("dist/ folder already exists");
}

for (const obj of successCritData) {
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

  const fileName = (obj.id as string).replace(/\./g, "-");
  await Deno.writeTextFile(`../dist/${fileName}.html`, successCritHtml);
}
