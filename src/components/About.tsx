import React from 'react';
import { Shield, Eye, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const cards = [
    {
      icon: Target,
      title: 'Mission',
      description: 'To ensure the safety and resilience of Pio Duran through effective disaster risk reduction and management.',
      color: 'text-blue-600'
    },
    {
      icon: Eye,
      title: 'Vision',
      description: 'A disaster-resilient community with zero casualties through proactive preparedness and efficient response.',
      color: 'text-green-600'
    },
    {
      icon: Target,
      title: 'Goal',
      description: 'To reduce vulnerability and enhance capacity of communities to prepare for, respond to, and recover from disasters.',
      color: 'text-purple-600'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Link 
            to="/about"
            className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-bold text-white rounded-full bg-gradient-to-r from-blue-600 to-blue-900 hover:from-yellow-400 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105"
          >
            <Shield className="mr-2" size={20} />
            <span className="text-lg font-semibold tracking-wide">About MDRRMO</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-blue-600"
            >
              <div className={`${card.color} text-5xl mb-4 text-center`}>
                <card.icon size={48} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-4 text-blue-900">
                {card.title}
              </h3>
              <p className="text-gray-600 text-center">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/about"
            className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-bold text-white rounded-full bg-gradient-to-r from-blue-600 to-blue-900 hover:from-yellow-400 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105"
          >
            <Users className="mr-2" size={20} />
            <span className="text-lg tracking-wide">Meet Our MDRRMO Staff</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;