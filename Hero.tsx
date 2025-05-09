import React from 'react';
import { ArrowDown, FileDown, Github, Linkedin } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section 
      id="home" 
      className="relative min-h-screen-dvh flex items-center justify-center overflow-hidden bg-gradient-to-b from-sand-50 to-stone-50 dark:from-stone-900 dark:to-stone-950"
    >
      {/* Background gradient circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-sand-200/20 to-stone-200/20 dark:from-sand-800/20 dark:to-stone-800/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-stone-200/20 to-sand-200/20 dark:from-stone-800/20 dark:to-sand-800/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8 animate-fade-up">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            <span className="block opacity-0 animate-fade-up [animation-delay:200ms]">
              Transformando Ideias
            </span>
            <span className="block mt-4 bg-gradient-to-r from-stone-900 to-stone-600 dark:from-stone-100 dark:to-stone-400 bg-clip-text text-transparent opacity-0 animate-fade-up [animation-delay:400ms]">
              em Experiências Digitais
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl sm:text-2xl text-stone-600 dark:text-stone-400 font-light leading-relaxed opacity-0 animate-fade-up [animation-delay:600ms]">
            Desenvolvedor Fullstack especializado em criar interfaces sofisticadas e sistemas robustos que elevam a experiência digital ao próximo nível.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 opacity-0 animate-fade-up [animation-delay:800ms]">
            <a 
              href="/resume.pdf" 
              download
              className="button-primary group"
            >
              <span className="relative flex items-center">
                <FileDown className="mr-2" size={20} />
                Baixar CV
              </span>
            </a>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-4 rounded-full bg-sand-100/80 dark:bg-stone-800/80 backdrop-blur-sm text-stone-900 dark:text-stone-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                aria-label="GitHub Profile"
              >
                <Github size={24} />
              </a>
              <a 
                href="https://linkedin.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-4 rounded-full bg-sand-100/80 dark:bg-stone-800/80 backdrop-blur-sm text-stone-900 dark:text-stone-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-up [animation-delay:1000ms]">
          <a 
            href="#about" 
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sand-100/80 dark:bg-stone-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Scroll to About section"
          >
            <ArrowDown className="text-stone-900 dark:text-stone-100" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;