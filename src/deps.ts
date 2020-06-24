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
