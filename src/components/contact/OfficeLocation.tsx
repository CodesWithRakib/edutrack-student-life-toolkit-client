import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const OfficeLocationsSection: React.FC = () => {
  const offices = [
    {
      city: "San Francisco",
      country: "United States",
      address: "123 Education Street\nSan Francisco, CA 94105",
      phone: "+1 (555) 123-4567",
      email: "sf@edutrack.com",
      hours: "Mon-Fri: 9AM-6PM PST",
      isHeadquarters: true,
    },
    {
      city: "New York",
      country: "United States",
      address: "456 Learning Avenue\nNew York, NY 10001",
      phone: "+1 (555) 234-5678",
      email: "ny@edutrack.com",
      hours: "Mon-Fri: 9AM-6PM EST",
      isHeadquarters: false,
    },
    {
      city: "London",
      country: "United Kingdom",
      address: "789 Knowledge Lane\nLondon, EC2A 1HQ",
      phone: "+44 20 7946 0958",
      email: "london@edutrack.com",
      hours: "Mon-Fri: 9AM-5PM GMT",
      isHeadquarters: false,
    },
    {
      city: "Singapore",
      country: "Singapore",
      address: "321 Innovation Road\nSingapore 068898",
      phone: "+65 6521 8900",
      email: "singapore@edutrack.com",
      hours: "Mon-Fri: 9AM-6PM SGT",
      isHeadquarters: false,
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Visit Our
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
              Offices Around the World
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            We have teams strategically located to serve our global community of
            students and institutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {offices.map((office, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              {office.isHeadquarters && (
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium mb-4">
                  Headquarters
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {office.city}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {office.country}
              </p>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                    {office.address}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {office.phone}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {office.email}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {office.hours}
                  </div>
                </div>
              </div>

              <button className="mt-6 w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Get Directions
              </button>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="h-96 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Interactive Map
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Interactive map showing all our office locations would be
                displayed here
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfficeLocationsSection;
