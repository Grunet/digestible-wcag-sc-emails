interface IParameters {
  text: string;
}

import { fleschKincaid, syllable } from "./deps.ts";

function getReadingLevel(params: IParameters): number {
  const { text } = params;

  const numSentences = text.split(".").length; //A rough overestimate
  const numWords = text.split(" ").length;
  const numSyllables = syllable(text);

  return fleschKincaid({
    sentence: numSentences,
    word: numWords,
    syllable: numSyllables,
  });
}

export { getReadingLevel };
