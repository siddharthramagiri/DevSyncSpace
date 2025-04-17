
const mongoose = require('mongoose');

const projectFileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['file', 'folder'],
    required: true
  },
  extension: String,
  size: String,
  content: String,
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectFile' }]
});

const teamMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'editor', 'viewer'],
    default: 'viewer'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  repository: String,
  technologies: [String],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  team: [teamMemberSchema],
  structure: [projectFileSchema],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const ProjectFile = mongoose.model('ProjectFile', projectFileSchema);
const Project = mongoose.model('Project', projectSchema);

module.exports = { Project, ProjectFile };
