import React from "react";
import { Twitter, Linkedin, Github } from "lucide-react";

const TeamSection: React.FC = () => {
  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Co-founder",
      bio: "Former educator with 10+ years in EdTech, passionate about making learning accessible.",
      image: "SJ",
      social: { twitter: "#", linkedin: "#", github: "#" },
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-founder",
      bio: "Full-stack developer with expertise in AI and machine learning applications in education.",
      image: "MC",
      social: { twitter: "#", linkedin: "#", github: "#" },
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      bio: "Product strategist focused on user experience and educational outcomes.",
      image: "ER",
      social: { twitter: "#", linkedin: "#", github: "#" },
    },
    {
      name: "David Kim",
      role: "Head of Engineering",
      bio: "Leading our technical team with 15+ years of software development experience.",
      image: "DK",
      social: { twitter: "#", linkedin: "#", github: "#" },
    },
    {
      name: "Lisa Wang",
      role: "Head of Design",
      bio: "Creating intuitive and beautiful interfaces that students love to use.",
      image: "LW",
      social: { twitter: "#", linkedin: "#", github: "#" },
    },
    {
      name: "James Wilson",
      role: "Head of Marketing",
      bio: "Building our community and spreading the word about EduTrack's mission.",
      image: "JW",
      social: { twitter: "#", linkedin: "#", github: "#" },
    },
  ];

  const advisors = [
    {
      name: "Dr. Patricia Brown",
      role: "Education Advisor",
      institution: "Stanford University",
      image: "PB",
    },
    {
      name: "Prof. Robert Taylor",
      role: "Technology Advisor",
      institution: "MIT",
      image: "RT",
    },
    {
      name: "Dr. Amanda White",
      role: "Research Advisor",
      institution: "Harvard University",
      image: "AW",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Meet the
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Team Behind EduTrack
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            We're a diverse group of educators, engineers, and designers united
            by our passion for improving education.
          </p>
        </div>

        {/* Leadership Team */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Leadership Team
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                    {member.image}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {member.name}
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {member.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {member.bio}
                </p>
                <div className="flex space-x-3">
                  {Object.entries(member.social).map(([platform, url], idx) => {
                    const Icon =
                      platform === "twitter"
                        ? Twitter
                        : platform === "linkedin"
                        ? Linkedin
                        : Github;
                    return (
                      <a
                        key={idx}
                        href={url}
                        className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisors */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Academic Advisors
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {advisors.map((advisor, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {advisor.image}
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                  {advisor.name}
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                  {advisor.role}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {advisor.institution}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Join Us CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Join Our Team
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            We're always looking for passionate individuals who want to make a
            difference in education. Check out our open positions.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all">
            View Open Positions
          </button>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
