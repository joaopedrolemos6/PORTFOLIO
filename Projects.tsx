import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "Uma plataforma completa de e-commerce com catálogo de produtos, carrinho, pagamentos e área de administração.",
    image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    githubUrl: "https://github.com/",
    liveUrl: "https://example.com"
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Aplicativo para gerenciamento de tarefas com funcionalidades de organização, lembretes e colaboração em equipe.",
    image: "https://images.pexels.com/photos/6956183/pexels-photo-6956183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tags: ["React", "Firebase", "Tailwind CSS"],
    githubUrl: "https://github.com/"
  },
  {
    id: 3,
    title: "Personal Finance Dashboard",
    description: "Dashboard para controle de finanças pessoais com visualização de gastos, receitas e planejamento financeiro.",
    image: "https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tags: ["Next.js", "TypeScript", "Chart.js", "PostgreSQL"],
    githubUrl: "https://github.com/",
    liveUrl: "https://example.com"
  },
  {
    id: 4,
    title: "Weather App",
    description: "Aplicativo de previsão do tempo com dados em tempo real e visualizações detalhadas para múltiplas localizações.",
    image: "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tags: ["React Native", "Weather API", "Geolocation"],
    githubUrl: "https://github.com/"
  }
];

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-sand-100 dark:bg-stone-800">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100">
            Meus Projetos
          </h2>
          <div className="w-20 h-1 bg-stone-600 dark:bg-stone-400 mx-auto mt-4"></div>
          <p className="text-lg text-stone-600 dark:text-stone-300 mt-4 max-w-2xl mx-auto">
            Uma seleção dos meus trabalhos recentes em desenvolvimento web e mobile.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-sand-50 dark:bg-stone-900 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-stone-800 dark:text-stone-100 mb-3">
                  {project.title}
                </h3>
                
                <p className="text-stone-600 dark:text-stone-300 mb-4">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 text-sm bg-sand-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-3">
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-sand-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-medium transition-all hover:bg-sand-300 dark:hover:bg-stone-600"
                  >
                    <Github className="mr-2" size={18} />
                    Github
                  </a>
                  
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-stone-800 text-stone-100 dark:bg-stone-100 dark:text-stone-800 font-medium transition-all hover:bg-stone-900 dark:hover:bg-stone-200"
                    >
                      <ExternalLink className="mr-2" size={18} />
                      Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;