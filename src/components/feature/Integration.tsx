import React from "react";
import { Smartphone, Monitor, Tablet, Github, Chrome } from "lucide-react";

const IntegrationSection: React.FC = () => {
  const platforms = [
    {
      name: "Desktop App",
      icon: Monitor,
      description: "Full-featured desktop application",
    },
    { name: "Web App", icon: Chrome, description: "Access from any browser" },
    {
      name: "Mobile App",
      icon: Smartphone,
      description: "iOS and Android apps",
    },
    { name: "Tablet App", icon: Tablet, description: "Optimized for tablets" },
  ];

  const integrations = [
    {
      name: "Google Calendar",
      icon: "G",
      description: "Sync your class schedule",
    },
    {
      name: "Microsoft Teams",
      icon: "M",
      description: "Integrate with study groups",
    },
    { name: "Dropbox", icon: "D", description: "Access your study materials" },
    { name: "Notion", icon: "N", description: "Connect your notes" },
    { name: "Slack", icon: "S", description: "Team communication" },
    { name: "Trello", icon: "T", description: "Task management" },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Works Everywhere You
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
              Study and Work
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Access EduTrack on all your devices and integrate with your favorite
            tools for a seamless experience.
          </p>
        </div>

        {/* Platforms */}
        <div className="mb-20">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            Available On
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platforms.map((platform, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mx-auto mb-4">
                  <platform.icon className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {platform.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {platform.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
            Integrations
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center font-bold text-lg text-gray-900 dark:text-white shadow-sm">
                    {integration.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {integration.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {integration.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Section */}
        <div className="mt-20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Developer API
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Build custom integrations and extend EduTrack's functionality
                with our powerful REST API.
              </p>
              <div className="space-y-4">
                {[
                  "RESTful API with comprehensive documentation",
                  "Webhook support for real-time updates",
                  "SDKs for popular programming languages",
                  "Sandbox environment for testing",
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Github className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <button className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
                View API Documentation
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="bg-gray-900 dark:bg-black rounded-lg p-4 font-mono text-sm text-green-400 mb-4">
                <div>GET /api/v1/schedule</div>
                <div>Authorization: Bearer YOUR_API_KEY</div>
              </div>
              <div className="space-y-3">
                <div className="text-sm">
                  <div className="text-gray-600 dark:text-gray-400 mb-1">
                    Response:
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded p-3 text-xs">
                    {`{
  "schedule": [
    {
      "id": "sched_123",
      "subject": "Mathematics",
      "time": "09:00",
      "duration": 60
    }
  ]
}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationSection;
