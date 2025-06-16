// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'VinaX',
            social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/thekun97' }],
            sidebar: [
                {
                    label: 'GenAI',
                    collapsed: true,
                    items: [
                        // Each item here is one entry in the navigation menu.
                        { 
                            label: 'Tối ưu hoá LLMs', 
                            slug: 'guides/improve_llm',
                        },
                        {
                            label: 'RAG',
                            collapsed: true,
                            autogenerate: { directory: 'guides/rag' },
                        },
                        {
                            label: 'Fine-tuning',
                            collapsed: true,
                            autogenerate: { directory: 'reference' },
                        },
                    ],
                },
                {
                    label: 'MLOps',
                    collapsed: true,
                    autogenerate: { directory: 'mlops' },
                },
                {
                    label: 'Our AI Agents',
                    collapsed: true,
                    autogenerate: { directory: 'ai_agents' },
                },
            ],
            pagination: false,
        }),
    ],
});