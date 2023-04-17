export enum ExternalURL {
  discord,
  twitter,
  notion,
  discourse,
  feelingNounish,
}

export const externalURL = (externalURL: ExternalURL) => {
  switch (externalURL) {
    case ExternalURL.discord:
      return 'https://discord.gg/xjARUcB3tJ';
    case ExternalURL.twitter:
      return 'https://twitter.com/lilnounsdao';
    case ExternalURL.notion:
      return 'https://lilnouns.notion.site/Explore-Lil-Nouns-db990658e6ab4cf19121b22642645032';
    case ExternalURL.discourse:
      return 'https://discourse.lilnouns.wtf/';
    case ExternalURL.feelingNounish:
      return 'https://nouns.ooo/';
  }
};
