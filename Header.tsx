import React, { useEffect, useState } from 'react';
import { Menu, X, Github, Linkedin } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-lg' : ''
      }`}
    >
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between px-6 py-4">
          <a
            href="#home"
            className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white focus:outline-none transition-transform hover:scale-105"
          >
            Portfolio
          </a>

          <nav className="hidden md:flex items-center space-x-12">
            <a href="#home" className="nav-link">
              Home
            </a>
            <a href="#about" className="nav-link">
              Sobre
            </a>
            <a href="#projects" className="nav-link">
              Projetos
            </a>
            <a href="#skills" className="nav-link">
              Habilidades
            </a>
            <a href="#contact" className="nav-link">
              Contato
            </a>
            <a href="#admin" className="nav-link">
              Painel
            </a>

            <div className="flex items-center space-x-6 ml-6">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                aria-label="GitHub Profile"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={20} />
              </a>
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
          </nav>

          <div className="flex items-center space-x-4 md:hidden">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl transform transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex flex-col h-full justify-center items-center space-y-8 p-8">
          <nav className="flex flex-col items-center space-y-8">
            <a
              href="#home"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Home
            </a>
            <a
              href="#about"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Sobre
            </a>
            <a
              href="#projects"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Projetos
            </a>
            <a
              href="#skills"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Habilidades
            </a>
            <a
              href="#contact"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Contato
            </a>
            <a
              href="#admin"
              className="mobile-nav-link"
              onClick={() => setIsOpen(false)}
            >
              Painel
            </a>
          </nav>

          <div className="flex space-x-8 mt-12">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              aria-label="GitHub Profile"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
