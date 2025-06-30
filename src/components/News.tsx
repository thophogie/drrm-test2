import React from 'react';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import SocialShareButtons from './SocialShareButtons';

const News: React.FC = () => {
  const newsItems = [
    {
      id: 1,
      date: 'June 29, 2025',
      title: 'BDRRM Planning Training/ Workshop for Barangay Officials',
      excerpt: 'On June 25, 2024, the Municipal Disaster Risk Reduction and Management Office (MDRRMO) conducted an essential training session on Barangay Disaster Risk Reduction and Management Planning at Barangay Basicao Interior. The event was designed to equip local leaders ...',
      image: 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575265/487673077_1062718335885316_7552782387266701410_n_gexfn2.jpg',
      url: '/news/bdrrm-training-workshop'
    },
    {
      id: 2,
      date: 'June 9, 2023',
      title: 'Successful Nationwide Simultaneous Earthquake Drill Conducted',
      excerpt: 'The municipality participated in the 2nd quarter nationwide simultaneous earthquake drill with over 5,000 participants from schools, offices, and communities.',
      image: 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575261/489043126_1065374988952984_1331524645056736117_n_fbmvch.jpg',
      url: '/news/earthquake-drill-2023'
    },
    {
      id: 3,
      date: 'May 24, 2023',
      title: '20 Volunteers Complete Water Rescue Training Course',
      excerpt: 'On November 19, 2021, the rescue volunteers of Pio Duran underwent intensive training in Basic Life Support, survival skills, and Water Search and Rescue (WASAR). This program was designed to equip them with essential life-saving techniques, ensuring they could effectively respond...',
      image: 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575263/472984055_1002760098547807_5747993743270536498_n_cgi07u.jpg',
      url: '/news/water-rescue-training'
    }
  ];

  return (
    <section className="py-16 bg-blue-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-yellow-500 text-center mb-8">
          News & Updates
        </h2>
        <p className="text-center text-gray-200 max-w-3xl mx-auto mb-12">
          Stay informed with the latest news, announcements, and events from the Municipality of Pio Duran.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {newsItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center text-sm text-blue-900 font-semibold mb-2">
                  <Calendar size={16} className="mr-2" />
                  {item.date}
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.excerpt}
                </p>
                
                {/* Social Share Buttons */}
                <div className="mb-4 border-t pt-4">
                  <SocialShareButtons
                    url={`${window.location.origin}${item.url}`}
                    title={item.title}
                    description={item.excerpt}
                    image={item.image}
                    size="sm"
                    showLabels={false}
                    hashtags={['MDRRMO', 'PioDuran', 'News']}
                  />
                </div>
                
                <button className="text-blue-600 font-semibold hover:text-blue-800 flex items-center transition-colors">
                  Read More
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-full shadow-lg hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95">
            <Newspaper className="mr-2" size={20} />
            View All News & Updates
          </button>
        </div>
      </div>
    </section>
  );
};

export default News;