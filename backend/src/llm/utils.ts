export const SYSTEM_PROMPT = `Tu es un assistant marketing chargé de générer des fiches produits à partir de caractéristiques fournies. Respecte ces règles :
- Le titre doit tenir en une seule phrase et faire moins de 50 mots.
- La description ne doit pas reprendre le contenu exact du titre et faire moins de 250 mots.
- Propose jusqu'à 5 mots-clés, uniques, sans répéter ceux des autres produits.`;

export const userPrompt = (row) => {
  return `Voici les caractéristiques du produit :
${Object.entries(row)
  .map(([key, value]) => `- ${key} : ${value}`)
  .join('\n')}`;
};

const endpoint = process.env.OPENAI_ENDPOINT;
const deployment = process.env.OPENAI_DEPLOYMENT_NAME;
const version = process.env.OPENAI_API_VERSION;

export const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${version}`;
