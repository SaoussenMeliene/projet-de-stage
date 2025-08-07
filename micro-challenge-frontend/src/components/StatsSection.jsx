import React from "react";
import { Target, Users, Award, Star } from "react-feather";

const stats = [
  {
    value: "24",
    label: "Défis actifs",
    color: "bg-green-500",
    icon: Target,
  },
  {
    value: "156",
    label: "Participants",
    color: "bg-blue-500",
    icon: Users,
  },
  {
    value: "12.5K",
    label: "Points distribués",
    color: "bg-yellow-500",
    icon: Award,
  },
  {
    value: "98%",
    label: "Taux de satisfaction",
    color: "bg-purple-500",
    icon: Star,
  },
];

const StatsSection = () => {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="flex flex-col items-center group transition-transform"
            >
              <div
                className={`${item.color} w-16 h-16 rounded-xl flex items-center justify-center mb-3 
                            transition-transform transform group-hover:scale-110`}
              >
                <IconComponent
                  size={32}
                  className="text-white transition-transform duration-300 group-hover:scale-125"
                />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{item.value}</h3>
              <p className="text-gray-600">{item.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default StatsSection;

