import React from 'react';
import { Code, Server, Layout, Database } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-sand-50 dark:bg-stone-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100">
            Sobre Mim
          </h2>
          <div className="w-20 h-1 bg-stone-600 dark:bg-stone-400 mx-auto mt-4"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-stone-600 dark:text-stone-300">
              Sou um desenvolvedor fullstack apaixonado por criar soluções digitais elegantes e eficientes. Com mais de 5 anos de experiência em desenvolvimento web, tenho trabalhado com uma variedade de tecnologias modernas para entregar produtos de alta qualidade.
            </p>
            <p className="text-lg text-stone-600 dark:text-stone-300">
              Minha jornada na programação começou com HTML e CSS, mas rapidamente evoluiu para abranger toda a stack de desenvolvimento, incluindo React, Node.js, e bancos de dados como MongoDB e PostgreSQL.
            </p>
            <p className="text-lg text-stone-600 dark:text-stone-300">
              Estou sempre buscando novos desafios e oportunidades para expandir meus conhecimentos e habilidades. Acredito em código limpo, bem estruturado e em seguir as melhores práticas da indústria.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-sand-100 dark:bg-stone-800 p-6 rounded-lg shadow-md transition-transform hover:transform hover:scale-105">
              <Code className="text-stone-600 dark:text-stone-400 mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2 text-stone-800 dark:text-stone-100">Frontend</h3>
              <p className="text-stone-600 dark:text-stone-300">
                React, Next.js, TypeScript, Tailwind CSS
              </p>
            </div>
            
            <div className="bg-sand-100 dark:bg-stone-800 p-6 rounded-lg shadow-md transition-transform hover:transform hover:scale-105">
              <Server className="text-stone-600 dark:text-stone-400 mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2 text-stone-800 dark:text-stone-100">Backend</h3>
              <p className="text-stone-600 dark:text-stone-300">
                Node.js, Express, NestJS, Python
              </p>
            </div>
            
            <div className="bg-sand-100 dark:bg-stone-800 p-6 rounded-lg shadow-md transition-transform hover:transform hover:scale-105">
              <Database className="text-stone-600 dark:text-stone-400 mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2 text-stone-800 dark:text-stone-100">Database</h3>
              <p className="text-stone-600 dark:text-stone-300">
                MongoDB, PostgreSQL, MySQL, Redis
              </p>
            </div>
            
            <div className="bg-sand-100 dark:bg-stone-800 p-6 rounded-lg shadow-md transition-transform hover:transform hover:scale-105">
              <Layout className="text-stone-600 dark:text-stone-400 mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2 text-stone-800 dark:text-stone-100">Design</h3>
              <p className="text-stone-600 dark:text-stone-300">
                UI/UX, Figma, Responsive Design
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;