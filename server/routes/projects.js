
const express = require('express');
const passport = require('passport');
const { Project, ProjectFile } = require('../models/Project');
const router = express.Router();

// Auth middleware
const authenticate = passport.authenticate('jwt', { session: false });

// Get all projects for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const projects = await Project.find({
      'team.user': req.user._id
    }).populate('owner', 'name email avatar')
      .populate('team.user', 'name email avatar');
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// Get a single project
router.get('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('team.user', 'name email avatar');
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is part of the project team
    const isTeamMember = project.team.some(member => 
      member.user._id.toString() === req.user._id.toString()
    );
    
    if (!isTeamMember && project.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have access to this project' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
});

// Create a new project
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, repository, technologies } = req.body;
    
    const newProject = new Project({
      name,
      description,
      repository,
      technologies,
      owner: req.user._id,
      team: [{ user: req.user._id, role: 'owner' }],
      structure: [],
      progress: 0
    });
    
    await newProject.save();
    
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
});

// Update a project
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, description, repository, technologies, progress } = req.body;
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is owner or admin
    const userRole = project.team.find(member => 
      member.user.toString() === req.user._id.toString()
    )?.role;
    
    if (project.owner.toString() !== req.user._id.toString() && 
        (!userRole || !['owner', 'admin'].includes(userRole))) {
      return res.status(403).json({ message: 'You do not have permission to update this project' });
    }
    
    // Update fields
    project.name = name || project.name;
    project.description = description || project.description;
    project.repository = repository || project.repository;
    project.technologies = technologies || project.technologies;
    project.progress = progress !== undefined ? progress : project.progress;
    project.lastUpdated = new Date();
    
    await project.save();
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
});

// Add a team member to a project
router.post('/:id/team', authenticate, async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is owner or admin
    const userRole = project.team.find(member => 
      member.user.toString() === req.user._id.toString()
    )?.role;
    
    if (project.owner.toString() !== req.user._id.toString() && 
        (!userRole || !['owner', 'admin'].includes(userRole))) {
      return res.status(403).json({ message: 'You do not have permission to add team members' });
    }
    
    // Check if user is already a team member
    if (project.team.some(member => member.user.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a team member' });
    }
    
    // Add user to team
    project.team.push({
      user: userId,
      role: role || 'viewer'
    });
    
    await project.save();
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error adding team member', error: error.message });
  }
});

// Delete a project
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Only owner can delete project
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the project owner can delete this project' });
    }
    
    await Project.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
});

module.exports = router;
