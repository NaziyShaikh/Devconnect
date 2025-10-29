import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Developers = () => {
  const { user } = useAuth();
  const [developers, setDevelopers] = useState([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState('');
  const [showAdminProfiles, setShowAdminProfiles] = useState(false);

  useEffect(() => {
    fetchDevelopers();
  }, []);

  useEffect(() => {
    filterDevelopers();
  }, [developers, searchTerm, selectedSkills, selectedExperience, showAdminProfiles]);

  const fetchDevelopers = async () => {
    try {
      const response = await axios.get('/api/users');
      setDevelopers(response.data.data);
    } catch (error) {
      console.error('Error fetching developers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDevelopers = () => {
    let filtered = developers.filter(dev => dev._id !== user._id);

    if (!showAdminProfiles) {
      filtered = filtered.filter(dev => dev.role !== 'admin');
    }

    if (searchTerm) {
      filtered = filtered.filter(dev =>
        dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.profile?.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.profile?.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter(dev =>
        selectedSkills.every(skill =>
          dev.profile?.skills?.some(devSkill =>
            devSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    if (selectedExperience) {
      filtered = filtered.filter(dev => dev.profile?.experience === selectedExperience);
    }

    setFilteredDevelopers(filtered);
  };

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const allSkills = [...new Set(
    developers
      .filter(dev => dev.profile?.skills)
      .flatMap(dev => dev.profile.skills)
  )];

  const getExperienceClass = (experience) => {
    switch (experience) {
      case 'Expert':
        return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
      case 'Advanced':
        return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white';
      case 'Intermediate':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation Spacer */}
      <div className="h-16"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent"> Developers</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connect with talented developers and build amazing projects together.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search by name or skills
            </label>
            <input
              type="text"
              placeholder="Search developers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
            />
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Experience Level
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Skills ({selectedSkills.length} selected)
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-left transition-all duration-200 bg-gray-50/50 hover:bg-white"
                onClick={() => document.getElementById('skills-dropdown').classList.toggle('hidden')}
              >
                {selectedSkills.length > 0
                  ? `${selectedSkills.length} skills selected`
                  : 'Select skills...'
                }
              </button>
              <div
                id="skills-dropdown"
                className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto hidden"
              >
                {allSkills.map(skill => (
                  <label key={skill} className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(skill)}
                      onChange={() => handleSkillToggle(skill)}
                      className="mr-3 text-emerald-600 focus:ring-emerald-500"
                    />
                    {skill}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => setShowAdminProfiles(!showAdminProfiles)}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
              showAdminProfiles
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-red-500/25'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg hover:shadow-gray-500/25'
            }`}
          >
            {showAdminProfiles ? 'Hide Admin Profiles' : 'Show Admin Profiles'}
          </button>
        </div>

        {(searchTerm || selectedSkills.length > 0 || selectedExperience) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {searchTerm && (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 font-medium">
                <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search: {searchTerm}
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-cyan-600 hover:text-cyan-800"
                >
                  ×
                </button>
              </span>
            )}
            {selectedSkills.map(skill => (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 font-medium">
                <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {skill}
                <button
                  onClick={() => handleSkillToggle(skill)}
                  className="ml-2 text-emerald-600 hover:text-emerald-800"
                >
                  ×
                </button>
              </span>
            ))}
            {selectedExperience && (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 font-medium">
                <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {selectedExperience}
                <button
                  onClick={() => setSelectedExperience('')}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
        </div>

        {/* Developers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDevelopers.map((developer) => (
          <div key={developer._id} className="group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="relative">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {developer.profile?.avatar ? (
                    <img
                      src={developer.profile.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {developer.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">{developer.name}</h3>
                  <p className="text-gray-600 text-sm">{developer.email}</p>
                </div>
              </div>

              {developer.profile?.bio && (
                <p className="text-gray-700 text-sm mb-6 line-clamp-3 leading-relaxed">
                  {developer.profile.bio}
                </p>
              )}

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Experience:
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getExperienceClass(developer.profile?.experience)}`}>
                    {developer.profile?.experience || 'Not specified'}
                  </span>
                </div>
              </div>

              {developer.profile?.skills && developer.profile.skills.length > 0 && (
                <div className="mb-6">
                  <span className="text-sm font-semibold text-gray-700 block mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Skills:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {developer.profile.skills.slice(0, 4).map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs rounded-full font-medium hover:from-gray-200 hover:to-gray-300 transition-colors">
                        {skill}
                      </span>
                    ))}
                    {developer.profile.skills.length > 4 && (
                      <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs rounded-full font-medium">
                        +{developer.profile.skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex space-x-3">
                  <Link
                    to={`/user-profile/${developer._id}`}
                    onClick={() => console.log('Navigating to user profile:', developer._id)}
                    className="flex-1 group/btn bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-3 px-4 rounded-xl text-sm font-semibold hover:from-green-400 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:scale-105"
                    aria-label={`View profile of ${developer.name}`}
                    title={`View profile of ${developer.name}`}
                  >
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      View Profile
                    </span>
                  </Link>
                  <Link
                    to={`/chat/${developer._id}`}
                    className="flex-1 group/btn bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-center py-3 px-4 rounded-xl text-sm font-semibold hover:from-blue-400 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
                    aria-label={`Chat with ${developer.name}`}
                    title={`Chat with ${developer.name}`}
                  >
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Chat
                    </span>
                  </Link>
                </div>
                <div className="flex space-x-3">
                  {developer.role === 'admin' && (
                    <span className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-center py-3 px-4 rounded-xl text-sm font-semibold shadow-lg">
                      <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Admin
                      </span>
                    </span>
                  )}
                  {developer.profile?.github && (
                    <a
                      href={developer.profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 group/link bg-gradient-to-r from-gray-800 to-gray-900 text-white text-center py-3 px-4 rounded-xl text-sm font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-gray-500/25 transform hover:scale-105"
                    >
                      <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                      </span>
                    </a>
                  )}
                  {developer.profile?.portfolio && (
                    <a
                      href={developer.profile.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 group/link bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-3 px-4 rounded-xl text-sm font-semibold hover:from-blue-400 hover:to-indigo-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
                    >
                      <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Portfolio
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDevelopers.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 max-w-md mx-auto">
            <svg className="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No developers found</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Try adjusting your search criteria or filters to discover amazing developers.
            </p>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Developers;
