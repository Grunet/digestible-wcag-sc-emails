import { getWcagData } from "./deps.ts";

// This should probably point to a pinned version of the typings
// @deno-types="https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/traverse/index.d.ts"
import traverse from "https://dev.jspm.io/traverse@0.6.6";

async function getSuccessCriteriaData(): Promise<any[]> {
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
          id: this.parent?.node["id"],
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

  return successCritData;
}

export { getSuccessCriteriaData };
