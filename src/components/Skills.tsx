import React from 'react'
import type { Skill } from '../types'

interface SkillsProps {
  skills: Skill[]
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  // Get proficiency color based on level
  const getProficiencyColor = (proficiency: Skill['proficiency']) => {
    switch (proficiency) {
      case 'Expert':
        return 'bg-green-500'
      case 'Advanced':
        return 'bg-blue-500'
      case 'Intermediate':
        return 'bg-yellow-500'
      case 'Beginner':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  // Get proficiency width for progress bar
  const getProficiencyWidth = (proficiency: Skill['proficiency']) => {
    switch (proficiency) {
      case 'Expert':
        return 'w-full'
      case 'Advanced':
        return 'w-3/4'
      case 'Intermediate':
        return 'w-1/2'
      case 'Beginner':
        return 'w-1/4'
      default:
        return 'w-1/4'
    }
  }

  // Determine if a skill is primary expertise (Expert or Advanced with 3+ years)
  const isPrimaryExpertise = (skill: Skill) => {
    return skill.proficiency === 'Expert' || 
           (skill.proficiency === 'Advanced' && (skill.yearsOfExperience || 0) >= 3)
  }

  return (
    <section id="skills" className="py-12 sm:py-16 lg:py-20 bg-gray-50" aria-labelledby="skills-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header - Enhanced responsive typography */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 id="skills-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Technical Skills
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              A comprehensive overview of my technical competencies and areas of expertise
            </p>
          </div>

          {/* Skills Grid - Enhanced responsive layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8" role="list" aria-label="Skills organized by category">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div 
                key={category} 
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200"
                role="listitem"
              >
                {/* Category Header - Responsive typography */}
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center border-b border-gray-200 pb-2 sm:pb-3">
                  {category}
                </h3>

                {/* Skills in Category - Enhanced responsive spacing */}
                <div className="space-y-3 sm:space-y-4" role="list" aria-label={`${category} skills`}>
                  {categorySkills.map((skill) => (
                    <div key={skill.name} className="relative" role="listitem">
                      {/* Skill Name and Experience - Responsive layout */}
                      <div className="flex justify-between items-center mb-1 sm:mb-2">
                        <span className={`font-medium text-sm sm:text-base ${isPrimaryExpertise(skill) ? 'text-blue-600' : 'text-gray-800'}`}>
                          {skill.name}
                          {isPrimaryExpertise(skill) && (
                            <span 
                              className="ml-1 sm:ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full"
                              aria-label="Primary expertise area"
                            >
                              Primary
                            </span>
                          )}
                        </span>
                        {skill.yearsOfExperience && (
                          <span className="text-xs sm:text-sm text-gray-500" aria-label={`${skill.yearsOfExperience} years of experience`}>
                            {skill.yearsOfExperience}y
                          </span>
                        )}
                      </div>

                      {/* Proficiency Level - Responsive text */}
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <span className="text-xs sm:text-sm text-gray-600">
                          {skill.proficiency}
                        </span>
                      </div>

                      {/* Progress Bar - Responsive sizing */}
                      <div 
                        className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2"
                        role="progressbar"
                        aria-valuenow={skill.proficiency === 'Expert' ? 100 : skill.proficiency === 'Advanced' ? 75 : skill.proficiency === 'Intermediate' ? 50 : 25}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${skill.name} proficiency: ${skill.proficiency}`}
                      >
                        <div 
                          className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${getProficiencyColor(skill.proficiency)} ${getProficiencyWidth(skill.proficiency)}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Primary Expertise Summary - Enhanced responsive layout */}
          <div className="mt-8 sm:mt-10 lg:mt-12 text-center" role="region" aria-labelledby="expertise-summary">
            <h3 id="expertise-summary" className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Primary Areas of Expertise
            </h3>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-4xl mx-auto" role="list" aria-label="Primary expertise areas">
              {skills
                .filter(isPrimaryExpertise)
                .map((skill) => (
                  <span
                    key={skill.name}
                    className="bg-blue-100 text-blue-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium"
                    role="listitem"
                  >
                    {skill.name}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills