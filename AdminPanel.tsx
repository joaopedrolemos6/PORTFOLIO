import React, { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, LogOut, ShieldCheck, PlusCircle } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { API_BASE_URL } from './api';
import type { Project } from './Projects';

interface AdminPanelProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

interface ProjectFormState {
  title: string;
  description: string;
  image: string;
  tags: string;
  githubUrl: string;
  liveUrl: string;
}

const initialFormState: ProjectFormState = {
  title: '',
  description: '',
  image: '',
  tags: '',
  githubUrl: '',
  liveUrl: '',
};

const AdminPanel: React.FC<AdminPanelProps> = ({ theme, toggleTheme }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('admin-token'));
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<ProjectFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`);
      if (!response.ok) {
        throw new Error('Não foi possível carregar os projetos.');
      }
      const data = (await response.json()) as Project[];
      setProjects(data);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar os projetos.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('admin-token', token);
    } else {
      localStorage.removeItem('admin-token');
    }
  }, [token]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!password.trim()) {
      toast.error('Informe a senha de administrador.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const message = (payload as { message?: string }).message ?? 'Senha inválida.';
        throw new Error(message);
      }

      const data = (await response.json()) as { token: string };
      setToken(data.token);
      setPassword('');
      toast.success('Autenticação realizada com sucesso.');
      fetchProjects();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Falha ao autenticar.');
    }
  };

  const handleLogout = () => {
    setToken(null);
    toast.success('Sessão encerrada.');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      toast.error('Faça login para gerenciar os projetos.');
      return;
    }

    if (!form.title.trim() || !form.description.trim() || !form.githubUrl.trim()) {
      toast.error('Título, descrição e link do GitHub são obrigatórios.');
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      githubUrl: form.githubUrl.trim(),
      liveUrl: form.liveUrl.trim() || undefined,
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const payloadResponse = await response.json().catch(() => ({}));
        const message = (payloadResponse as { message?: string }).message ?? 'Não foi possível criar o projeto.';
        throw new Error(message);
      }

      const project = (await response.json()) as Project;
      setProjects((prev) => [project, ...prev]);
      setForm(initialFormState);
      toast.success('Projeto cadastrado com sucesso!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao cadastrar o projeto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!token) {
      toast.error('Faça login para gerenciar os projetos.');
      return;
    }

    if (!window.confirm('Tem certeza que deseja remover este projeto?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        const message = (payload as { message?: string }).message ?? 'Não foi possível remover o projeto.';
        throw new Error(message);
      }

      setProjects((prev) => prev.filter((project) => project.id !== projectId));
      toast.success('Projeto removido.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao remover o projeto.');
    }
  };

  return (
    <section id="admin" className="py-20 px-4 sm:px-6 lg:px-8 bg-sand-100/70 dark:bg-stone-900/70">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-3">
              <ShieldCheck size={28} /> Painel Administrativo
            </h2>
            <p className="text-stone-600 dark:text-stone-300 mt-2">
              Autentique-se para adicionar novos projetos ou remover itens do portfólio em tempo real.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-red-200 text-red-600 px-4 py-2 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-900/30 transition"
              >
                <LogOut size={18} /> Sair
              </button>
            ) : null}
          </div>
        </div>

        {!isAuthenticated && (
          <div className="bg-white dark:bg-stone-900 border border-sand-200 dark:border-stone-800 rounded-2xl shadow-lg p-8 md:p-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                  Senha de administrador
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Insira a senha configurada no servidor"
                  className="mt-2 w-full rounded-xl border border-sand-200 dark:border-stone-700 bg-white/90 dark:bg-stone-950/80 px-4 py-3 text-stone-900 dark:text-stone-100 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/60"
                  required
                />
              </div>

              <button type="submit" className="button-primary w-full sm:w-auto">
                Entrar
              </button>
            </form>
          </div>
        )}

        {isAuthenticated && (
          <div className="space-y-10">
            <div className="bg-white dark:bg-stone-900 border border-sand-200 dark:border-stone-800 rounded-2xl shadow-lg p-8 md:p-10">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleCreateProject}>
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <PlusCircle size={22} /> Novo projeto
                  </h3>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                    Título
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-sand-200 dark:border-stone-700 bg-white/90 dark:bg-stone-950/80 px-4 py-3 text-stone-900 dark:text-stone-100 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/60"
                    placeholder="Nome do projeto"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-sand-200 dark:border-stone-700 bg-white/90 dark:bg-stone-950/80 px-4 py-3 text-stone-900 dark:text-stone-100 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/60"
                    rows={4}
                    placeholder="Explique brevemente o escopo e diferencial do projeto"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                    URL da imagem
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="url"
                    value={form.image}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-sand-200 dark:border-stone-700 bg-white/90 dark:bg-stone-950/80 px-4 py-3 text-stone-900 dark:text-stone-100 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/60"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                    Tags (separadas por vírgula)
                  </label>
                  <input
                    id="tags"
                    name="tags"
                    type="text"
                    value={form.tags}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-sand-200 dark:border-stone-700 bg-white/90 dark:bg-stone-950/80 px-4 py-3 text-stone-900 dark:text-stone-100 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/60"
                    placeholder="React, Node.js, Tailwind"
                  />
                </div>

                <div>
                  <label htmlFor="githubUrl" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                    Link do GitHub
                  </label>
                  <input
                    id="githubUrl"
                    name="githubUrl"
                    type="url"
                    value={form.githubUrl}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-sand-200 dark:border-stone-700 bg-white/90 dark:bg-stone-950/80 px-4 py-3 text-stone-900 dark:text-stone-100 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/60"
                    placeholder="https://github.com/seu-usuario/seu-projeto"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="liveUrl" className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                    Link da demo (opcional)
                  </label>
                  <input
                    id="liveUrl"
                    name="liveUrl"
                    type="url"
                    value={form.liveUrl}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-xl border border-sand-200 dark:border-stone-700 bg-white/90 dark:bg-stone-950/80 px-4 py-3 text-stone-900 dark:text-stone-100 focus:border-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/60"
                    placeholder="https://meuprojeto.com"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="button-primary"
                  >
                    {isSubmitting ? 'Salvando...' : 'Adicionar projeto'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white dark:bg-stone-900 border border-sand-200 dark:border-stone-800 rounded-2xl shadow-lg p-8 md:p-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">Projetos cadastrados</h3>
                {isLoading && <span className="text-sm text-stone-500 dark:text-stone-400">Carregando...</span>}
              </div>

              {projects.length === 0 ? (
                <p className="text-stone-600 dark:text-stone-300">
                  Você ainda não adicionou nenhum projeto. Utilize o formulário acima para começar a construir seu portfólio.
                </p>
              ) : (
                <ul className="space-y-4">
                  {projects.map((project) => (
                    <li
                      key={project.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-sand-200 dark:border-stone-800 rounded-xl p-4"
                    >
                      <div>
                        <p className="text-lg font-semibold text-stone-900 dark:text-stone-100">{project.title}</p>
                        <p className="text-sm text-stone-600 dark:text-stone-400 max-w-2xl">
                          {project.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 text-red-600 px-4 py-2 hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-900/30 transition"
                      >
                        <Trash2 size={18} /> Remover
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminPanel;
