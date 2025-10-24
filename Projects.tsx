import React, { useCallback, useEffect, useState } from 'react';
import { ExternalLink, Github, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from './api';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`);
      if (!response.ok) {
        throw new Error('Não foi possível carregar os projetos.');
      }

      const data = (await response.json()) as Project[];
      setProjects(data);
    } catch (err) {
      console.error('Erro ao carregar projetos', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-sand-100 dark:bg-stone-800">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100">
              Meus Projetos
            </h2>
            <button
              type="button"
              onClick={loadProjects}
              className="p-2 rounded-full bg-sand-200 dark:bg-stone-700 text-stone-800 dark:text-stone-100 hover:bg-sand-300 dark:hover:bg-stone-600 transition"
              aria-label="Atualizar projetos"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
          <div className="w-20 h-1 bg-stone-600 dark:bg-stone-400 mx-auto mt-4" />
          <p className="text-lg text-stone-600 dark:text-stone-300 mt-4 max-w-2xl mx-auto">
            Uma seleção dos meus trabalhos recentes em desenvolvimento web e mobile.
          </p>
        </div>

        {isLoading && (
          <div className="text-center text-stone-600 dark:text-stone-300">Carregando projetos...</div>
        )}

        {error && !isLoading && (
          <div className="text-center text-red-600 dark:text-red-400 mb-8">
            {error}
          </div>
        )}

        {!isLoading && !error && projects.length === 0 && (
          <div className="text-center text-stone-600 dark:text-stone-300">
            Nenhum projeto cadastrado ainda. Acesse o painel administrativo para adicionar novos trabalhos.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-sand-50 dark:bg-stone-900 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={project.image || 'https://via.placeholder.com/600x400?text=Projeto'}
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
                      key={`${project.id}-${tag}-${index}`}
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
