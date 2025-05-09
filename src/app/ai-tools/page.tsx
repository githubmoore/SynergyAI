
import MainLayout from "@/components/layout/main-layout";
import Image from "next/image"; // Using next/image for consistency, though img is also fine.

const aiTools = [
  {
    name: 'ChatGPT',
    type: 'Texto / Chatbot',
    url: 'https://chat.openai.com/',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    iframe: '',
    description: 'Modelo de lenguaje avanzado para generación y conversación de texto.'
  },
  {
    name: 'Gemini',
    type: 'Texto / Generación',
    url: 'https://gemini.google.com/',
    logo: 'https://www.gstatic.com/lamda/images/favicon_v2_64px.png',
    iframe: '',
    description: 'IA generativa de Google enfocada en tareas complejas y contexto largo.'
  },
  {
    name: 'Leonardo.AI',
    type: 'Imágenes',
    url: 'https://app.leonardo.ai/',
    logo: 'https://app.leonardo.ai/favicon.ico',
    iframe: '<iframe src="https://app.leonardo.ai/" width="100%" height="600" style="border:none; border-radius: 0.5rem;" title="Leonardo.AI Preview"></iframe>',
    description: 'Generador de imágenes con control creativo y modelos entrenados.'
  },
  {
    name: 'PlaygroundAI',
    type: 'Imágenes',
    url: 'https://playgroundai.com/',
    logo: 'https://playgroundai.com/favicon.ico',
    iframe: '<iframe src="https://playgroundai.com/" width="100%" height="600" style="border:none; border-radius: 0.5rem;" title="PlaygroundAI Preview"></iframe>',
    description: 'Plataforma para creación de imágenes con múltiples estilos artísticos.'
  },
  {
    name: 'Replicate',
    type: 'Modelos / Código',
    url: 'https://replicate.com/',
    logo: 'https://replicate.com/favicon.ico',
    iframe: '',
    description: 'Corre modelos de IA desde la nube. Acceso API para desarrolladores.'
  },
  {
    name: 'RunwayML',
    type: 'Video e Imagen',
    url: 'https://app.runwayml.com/',
    logo: 'https://runwayml.com/favicon.ico',
    iframe: '<iframe src="https://app.runwayml.com/" width="100%" height="600" style="border:none; border-radius: 0.5rem;" title="RunwayML Preview"></iframe>',
    description: 'Edición y generación de video con IA avanzada.'
  },
  {
    name: 'Claude',
    type: 'Texto / Chatbot',
    url: 'https://claude.ai/',
    logo: 'https://www.anthropic.com/favicon-32x32.png', // Using official favicon from similar tool entry
    iframe: '',
    description: 'Modelo de lenguaje conversacional enfocado en seguridad y utilidad.'
  },
  {
    name: 'DALL·E',
    type: 'Imágenes',
    url: 'https://openai.com/dall-e-3', // Updated to DALL-E 3 link
    logo: 'https://openai.com/content/images/2022/04/dalle-2-cropped.png', // Existing logo, suitable for DALL-E series
    iframe: '',
    description: 'Genera imágenes realistas y arte a partir de descripciones en lenguaje natural.'
  },
  {
    name: 'MidJourney',
    type: 'Imágenes',
    url: 'https://www.midjourney.com/',
    logo: 'https://docs.midjourney.com/static/media/favicon.4c472580.ico',
    iframe: '', // Midjourney typically operates via Discord, direct iframe less common
    description: 'Generador de imágenes conocido por su estilo artístico y calidad visual.'
  },
  {
    name: 'Perplexity AI',
    type: 'Texto / Búsqueda',
    url: 'https://www.perplexity.ai/',
    logo: 'https://www.perplexity.ai/favicon.ico',
    iframe: '',
    description: 'Motor de búsqueda conversacional que proporciona respuestas con fuentes citadas.'
  },
  {
    name: 'Poe',
    type: 'Texto / Multi-Chatbot',
    url: 'https://poe.com/',
    logo: 'https://poe.com/_next/static/media/favicon.png',
    iframe: '',
    description: 'Plataforma para acceder y conversar con múltiples chatbots de IA.'
  },
  {
    name: 'Mistral AI',
    type: 'Texto / Modelos',
    url: 'https://mistral.ai/',
    logo: 'https://mistral.ai/favicon.ico',
    iframe: '',
    description: 'Desarrolla modelos de lenguaje abiertos y optimizados.'
  }
];

export default function AIToolsPage() {
  return (
    <MainLayout pageTitle="AI Tools Showcase" pageIconName="AppWindow">
      <div className="p-0 md:p-4"> {/* Adjusted padding for consistency */}
        <h1 className="text-3xl font-bold mb-6 text-foreground">Herramientas de IA</h1>
        <p className="mb-8 text-muted-foreground">
          Explora una selección de herramientas de Inteligencia Artificial. Algunas ofrecen vistas previas integradas para una demostración rápida.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTools.map(tool => (
            <div key={tool.name} className="bg-card border border-border rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="p-4">
                <div className="flex items-center gap-4 mb-3">
                  <Image src={tool.logo} alt={`${tool.name} logo`} width={40} height={40} className="rounded-md" data-ai-hint={`${tool.type.split(' ')[0].toLowerCase()} logo`} />
                  <div>
                    <h2 className="text-xl font-semibold text-card-foreground">{tool.name}</h2>
                    <p className="text-sm text-muted-foreground">{tool.type}</p>
                  </div>
                </div>
                <p className="mb-3 text-sm text-card-foreground/90 min-h-[40px]">{tool.description}</p>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
                >
                  Visitar Sitio Web
                </a>
              </div>
              {tool.iframe && (
                <div className="mt-auto p-4 border-t border-border">
                  <h3 className="text-md font-medium mb-2 text-card-foreground">Vista previa interactiva</h3>
                  {/* Ensure iframe URLs are trusted. Using dangerouslySetInnerHTML requires caution. */}
                  <div className="aspect-video overflow-hidden rounded-md border border-input" dangerouslySetInnerHTML={{ __html: tool.iframe }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
