export const SYSTEM_PROMPT = `Tu es un assistant marketing chargé de générer des fiches produits à partir de caractéristiques fournies. Respecte ces règles :
- Le titre doit tenir en une seule phrase et faire moins de 50 mots.
- La description ne doit pas reprendre le contenu exact du titre et faire moins de 250 mots.
- Propose jusqu'à 5 mots-clés, uniques, sans répéter ceux des autres produits.
- Réponds uniquement en JSON avec les clés : "title", "description", "keywords".
`;
export const userPrompt = (
  row: Record<string, any>,
  usedKeywords: string[],
) => {
  return `Voici les caractéristiques du produit :
${Object.entries(row)
  .map(([k, v]) => `- ${k} : ${v}`)
  .join('\n')}

Mots-clés déjà utilisés : ${usedKeywords.join(', ') || 'aucun'}

Réponds **uniquement** avec ce format JSON :

{
  "title": "Titre généré ici",
  "description": "Description générée ici",
  "keywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3"]
}
`;
};

const endpoint = process.env.OPENAI_ENDPOINT;
const deployment = process.env.OPENAI_DEPLOYMENT_NAME;
const version = process.env.OPENAI_API_VERSION;

export const url = `https://az-dev-swc-epsi-cog-002-xfq.openai.azure.com/openai/deployments/${deployment}/chat/completions?api-version=${version}`;
