// app/(main)/challenges/[challengeId]/page.js
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ChallengePage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.challengeId;
  
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  
  // Load challenge data
  useEffect(() => {
    // In a real app, fetch from API or database
    // For now, using mock data based on challengeId
    const mockChallenges = {
      '1': {
        id: '1',
        title: 'Build a RESTful API with Authentication',
        description: 'Create a secure backend API with user authentication, role-based access control, and data validation.',
        skill: 'Backend Development',
        points: 250,
        estimatedHours: 12,
        difficulty: 'Intermediate'
      },
      '2': {
        id: '2',
        title: 'Database Design Fundamentals',
        description: 'Design a normalized database schema for an e-commerce platform.',
        skill: 'Database Design',
        points: 150,
        estimatedHours: 8,
        difficulty: 'Beginner'
      }
    };
    
    setChallenge(mockChallenges[challengeId] || mockChallenges['1']);
    setLoading(false);
  }, [challengeId]);

  // 🔥 ADD THIS FUNCTION - Challenge completion handler
  const handleChallengeComplete = (challengeData, score, passed) => {
    // Create challenge object
    const completedChallenge = {
      id: challengeData.id,
      title: challengeData.title,
      description: challengeData.description,
      skill: challengeData.skill || 'General',
      score: score,
      passed: passed,
      points: challengeData.points || Math.round(score),
      completedAt: new Date().toISOString(),
      estimatedHours: challengeData.estimatedHours || 4
    };

    // 1. Get existing completed challenges
    const completedChallenges = JSON.parse(localStorage.getItem('completed_challenges') || '[]');
    
    // 2. Add new challenge
    completedChallenges.push(completedChallenge);
    
    // 3. Save back to localStorage
    localStorage.setItem('completed_challenges', JSON.stringify(completedChallenges));
    
    // 4. Update stats for dashboard
    const currentStats = JSON.parse(localStorage.getItem('worker_stats') || '{}');
    const newStats = {
      challengesCompleted: completedChallenges.length,
      totalPoints: (currentStats.totalPoints || 0) + (challengeData.points || score || 0),
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('worker_stats', JSON.stringify(newStats));
    
    // 5. Add to recent activity
    const recentActivity = JSON.parse(localStorage.getItem('recent_activity') || '[]');
    recentActivity.unshift({
      icon: '✅',
      title: 'Completed challenge',
      sub: challengeData.title,
      time: 'Just now',
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('recent_activity', JSON.stringify(recentActivity.slice(0, 10)));
    
    // 6. Show success message
    alert('Challenge completed! 🎉');
    
    // 7. Redirect to dashboard or tracker
    router.push('/dashboard/worker/tracker');
  };

  // Mock function to simulate challenge submission
  const handleSubmitChallenge = () => {
    // In a real app, you'd validate the answer, calculate score, etc.
    const mockScore = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
    const passed = mockScore >= 70;
    
    handleChallengeComplete(challenge, mockScore, passed);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Challenge not found</h1>
        <button 
          onClick={() => router.back()}
          className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Challenge Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">⚡</span>
          <h1 className="text-3xl font-bold text-gray-800">{challenge.title}</h1>
        </div>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>Skill: {challenge.skill}</span>
          <span>•</span>
          <span>Difficulty: {challenge.difficulty}</span>
          <span>•</span>
          <span>Points: {challenge.points}</span>
          <span>•</span>
          <span>Est. {challenge.estimatedHours} hours</span>
        </div>
      </div>

      {/* Challenge Description */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <p className="text-gray-700">{challenge.description}</p>
      </div>

      {/* Challenge Workspace */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Solution</h2>
        
        {/* This is where your challenge interface goes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Answer
          </label>
          <textarea
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Write your solution here..."
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
          />
        </div>

        {/* Submit Button - This triggers the challenge completion */}
        <button
          onClick={handleSubmitChallenge}
          disabled={!userAnswer.trim()}
          className={`px-6 py-3 rounded-lg font-semibold text-white ${
            !userAnswer.trim() 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700'
          }`}
        >
          Submit Challenge
        </button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          ← Back to Challenges
        </button>
      </div>
    </div>
  );
}