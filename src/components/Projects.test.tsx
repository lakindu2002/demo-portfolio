import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Projects from './Projects'
import type { Project } from '../types'

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Test Project',
    description: 'A test project description',
    detailedDescription: 'A detailed test project description',
    technologies: ['React', 'TypeScript'],
    duration: '2 months',
    previewImage: '/test-image.jpg',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/test/project',
    featured: true
  },
  {
    id: '2',
    title: 'Another Project',
    description: 'Another project description',
    technologies: ['JavaScript', 'Node.js'],
    duration: '1 month',
    previewImage: '/another-image.jpg',
    githubUrl: 'https://github.com/test/another',
    featured: false
  }
]

describe('Projects Component', () => {
  it('renders projects section with title', () => {
    render(<Projects projects={mockProjects} />)
    
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText(/Here are some of the projects I've worked on/)).toBeInTheDocument()
  })

  it('renders all project cards', () => {
    render(<Projects projects={mockProjects} />)
    
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('Another Project')).toBeInTheDocument()
    expect(screen.getByText('A test project description')).toBeInTheDocument()
    expect(screen.getByText('Another project description')).toBeInTheDocument()
  })

  it('displays project technologies', () => {
    render(<Projects projects={mockProjects} />)
    
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
  })

  it('displays project duration', () => {
    render(<Projects projects={mockProjects} />)
    
    expect(screen.getByText('Duration: 2 months')).toBeInTheDocument()
    expect(screen.getByText('Duration: 1 month')).toBeInTheDocument()
  })

  it('shows featured badge for featured projects', () => {
    render(<Projects projects={mockProjects} />)
    
    expect(screen.getByText('Featured')).toBeInTheDocument()
  })

  it('renders action buttons correctly', () => {
    render(<Projects projects={mockProjects} />)
    
    // Should have View Details buttons for all projects
    expect(screen.getAllByText('View Details')).toHaveLength(2)
    
    // Should have Live Demo button for project with liveUrl
    expect(screen.getByText('Live Demo')).toBeInTheDocument()
    
    // Should have GitHub buttons for projects with githubUrl
    expect(screen.getAllByText('GitHub')).toHaveLength(2)
  })

  it('sorts featured projects first', () => {
    render(<Projects projects={mockProjects} />)
    
    // Check that the featured project appears first by looking at the project titles
    const projectTitles = screen.getAllByRole('heading', { level: 3 })
    expect(projectTitles[0]).toHaveTextContent('Test Project')
    expect(projectTitles[1]).toHaveTextContent('Another Project')
  })
})