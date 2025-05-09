import React from 'react';

interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'database' | 'tools';
}

const skills: Record<string, Skill[]> = {
  frontend: [
    { name: 'HTML/CSS', level: 95, category: 'frontend' },
    { name: 'JavaScript', level: 90, category: 'frontend' },
    { name: 'React', level: 92, category: 'frontend' },
    { name: 'TypeScript', level: 85, category: 'frontend' },
    { name: 'Tailwind CSS', level: 90, category: 'frontend' },
    { name: 'Next.js', level: 80, category: 'frontend' },
  ],
  backend: [
    { name: 'Node.js', level: 88, category: 'backend' },
    { name: 'Express', level: 85, category: 'backend' },
    { name: 'Python', level: 75, category: 'backend' },
    { name: 'GraphQL', level: 70, category: 'backend' },
    { name: 'REST APIs', level: 92, category: 'backend' },
  ],
  database: [
    { name: 'MongoDB', level: 88, category: 'database' },
    { name: 'PostgreSQL', level: 82, category: 'database' },
    { name: 'MySQL', level: 85, category: 'database' },
    { name: 'Firebase', level: 78, category: 'database' },
  ],
  tools: [
    { name: 'Git/GitHub', level: 90, category: 'tools' },
    { name: 'Docker', level: 75, category: 'tools' },
    { name: 'CI/CD', level: 70, category: 'tools' },
    { name: 'Jest', level: 80, category: 'tools' },
    { name: 'Figma', level: 75, category: 'tools' },
  ],
};

const categoryTitles: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Banco de Dados',
  tools: 'Ferramentas & DevOps',
};

const SkillBar: React.FC<{ skill: Skill }> = ({ skill }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-stone-700 dark:text-stone-300 font-medium">
          {skill.name}
        </span>
        <span className="text-sm text-stone-600 dark:text-stone-400">
          {skill.level}%
        </span>
      </div>
      <div className="w-full bg-sand-200 dark:bg-stone-700 rounded-full h-2.5">
        <div 
          className="bg-stone-600 dark:bg-stone-400 h-2.5 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${skill.level}%` }}
        ></div>
      </div>
    </div>
  );
};

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-sand-50 dark:bg-stone-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 dark:text-stone-100">
            Minhas Habilidades
          </h2>
          <div className="w-20 h-1 bg-stone-600 dark:bg-stone-400 mx-auto mt-4"></div>
          <p className="text-lg text-stone-600 dark:text-stone-300 mt-4 max-w-2xl mx-auto">
            Um panorama das minhas competências técnicas e conhecimentos em diversas áreas do desenvolvimento.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {Object.entries(skills).map(([category, categorySkills]) => (
            <div key={category}>
              <h3 className="text-xl font-semibold mb-6 text-stone-800 dark:text-stone-100">
                {categoryTitles[category]}
              </h3>
              
              <div className="space-y-6">
                {categorySkills.map((skill) => (
                  <SkillBar key={skill.name} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;