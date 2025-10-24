import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-stone-900 text-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-stone-800 pb-8">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold">Portfolio</h2>
            <p className="text-stone-400 mt-2 max-w-md">
              Desenvolvedor fullstack focado em criar experiências digitais excepcionais
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a 
              href="https://github.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-stone-400 transition-colors p-2"
              aria-label="GitHub Profile"
            >
              <Github size={24} />
            </a>
            <a 
              href="https://linkedin.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-stone-400 transition-colors p-2"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="mailto:contato@exemplo.com" 
              className="hover:text-stone-400 transition-colors p-2"
              aria-label="Email"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
        
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-stone-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Desenvolvedor. Todos os direitos reservados.
          </div>
          
          <div className="flex space-x-8">
            <a href="#home" className="text-stone-400 hover:text-stone-100 transition-colors text-sm">
              Home
            </a>
            <a href="#about" className="text-stone-400 hover:text-stone-100 transition-colors text-sm">
              Sobre
            </a>
            <a href="#projects" className="text-stone-400 hover:text-stone-100 transition-colors text-sm">
              Projetos
            </a>
            <a href="#skills" className="text-stone-400 hover:text-stone-100 transition-colors text-sm">
              Habilidades
            </a>
            <a href="#contact" className="text-stone-400 hover:text-stone-100 transition-colors text-sm">
              Contato
            </a>
            <a href="#admin" className="text-stone-400 hover:text-stone-100 transition-colors text-sm">
              Painel
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;