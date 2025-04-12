export const SYSTEM_PROMPT = `Tu es un assistant marketing chargé de générer des fiches produits à partir de caractéristiques fournies. Respecte ces règles :
- Le titre doit tenir en une seule phrase et faire moins de 50 mots.
- La description ne doit pas reprendre le contenu exact du titre et faire moins de 250 mots.
- Propose jusqu'à 5 mots-clés, uniques, sans répéter ceux des autres produits.`;

export const userPrompt = (row, usedKeywords) => {
  return `Voici les caractéristiques du produit :
${Object.entries(row)
  .map(([k, v]) => `- ${k} : ${v}`)
  .join('\n')}

Mots-clés déjà utilisés : ${usedKeywords.join(', ') || 'aucun'}

Génère :
1. Un titre
2. Une description
3. Une liste de mots-clés (max 5, sans doublons avec ceux ci-dessus)`;
};

const endpoint = process.env.OPENAI_ENDPOINT;
const deployment = process.env.OPENAI_DEPLOYMENT_NAME;
const version = process.env.OPENAI_API_VERSION;

export const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${version}`;
