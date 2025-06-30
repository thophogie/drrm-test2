import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const emergencyHotlines = [
    { name: 'Office of the Mayor', number: '(052) 123-4567' },
    { name: 'MDRRMO', number: '911 / (052) 234-5678' },
    { name: 'MSWD', number: '1343' },
    { name: 'Medical/MHO', number: '(052) 345-6789' },
    { name: 'PNP', number: '117 / (052) 456-7890' },
    { name: 'BFP', number: '(052) 567-8901' },
    { name: 'PCG', number: '(052) 678-9012' }
  ];

  const quickLinks = [
    'About Us',
    'Programs & Services',
    'Emergency Contacts',
    'Weather Updates',
    'Privacy Policy'
  ];

  return (
    <footer className="bg-blue-950 text-white border-t-4 border-yellow-500 shadow-lg">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* MDRRMO Contact Info */}
        <div className="text-sm">
          <h2 className="text-lg font-semibold mb-4">MDRRMO - Pio Duran</h2>
          <div className="space-y-2">
            <p className="flex items-center">
              <MapPin className="mr-2" size={16} />
              Municipal Hall, Pio Duran, Albay
            </p>
            <p className="flex items-center">
              <Phone className="mr-2" size={16} />
              Emergency Hotline: 911
            </p>
            <p className="flex items-center">
              <Mail className="mr-2" size={16} />
              mdrrmo@pioduran.gov.ph
            </p>
          </div>
          <p className="mt-4 text-gray-400">
            Committed to safety and resilience in our community.
          </p>
        </div>

        {/* Quick Links */}
        <div className="text-sm">
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <a href="#" className="hover:text-yellow-400 transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Emergency Hotline Numbers */}
        <div className="text-sm">
          <h2 className="text-lg font-semibold mb-4">Emergency Hotlines</h2>
          <ul className="space-y-1">
            {emergencyHotlines.map((hotline, index) => (
              <li key={index} className="text-yellow-500">
                <strong>{hotline.name}:</strong>{' '}
                <a href={`tel:${hotline.number.replace(/[^\d]/g, '')}`} className="text-white hover:underline">
                  {hotline.number}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Google Map Embed */}
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d627.0440762880165!2d123.455991!3d13.044111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a01dcb8f5dc12d%3A0xf32c415c60d3f10f!2sMunicipal%20Hall%20of%20Pio%20Duran%2C%20Albay!5e0!3m2!1sen!2sph!4v1718610900000"
            width="300"
            height="200"
            style={{ border: 0, borderRadius: '8px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="MDRRMO Location"
          />
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-gray-800 text-center text-sm py-4">
        &copy; 2025 MDRRMO Pio Duran, Albay. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;