import {
  getTemplateHtml,
  IOverrideInfo,
} from "https://raw.githubusercontent.com/Grunet/digestible-wcag-templates/master/dist/endpoints/success-criterion-focused.ts";
import { prepHtml } from "https://raw.githubusercontent.com/Grunet/digestible-wcag-email-prep/master/dist/ts/emailPrep.ts";
const wcagDataURL =
  "https://raw.githubusercontent.com/Grunet/digestible-wcag-scraping/master/dist/wcag22.json";

async function getWcagData(): Promise<any> {
  const res = await fetch(wcagDataURL);

  const jsonText = new TextDecoder("utf-8").decode(
    new Uint8Array(await res.arrayBuffer()),
  );

  const obj = JSON.parse(jsonText);

  return obj;
}

export { getTemplateHtml, IOverrideInfo, prepHtml, getWcagData };

import fleschKincaid from "https://dev.jspm.io/flesch-kincaid@1.0.5";
import syllable from "https://dev.jspm.io/syllable@3.6.0";

export { fleschKincaid, syllable };

function deepCopyObj<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)); //This doesn't take into account all subtleties. Replace with a library as needed.
}
export { deepCopyObj };
