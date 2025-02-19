import React from 'react';
import { Bell, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Dashboard = () => {
  // Sample period data for the chart
  const periodData = [
    { month: "Jan", length: 28 },
    { month: "Feb", length: 30 },
    { month: "Mar", length: 27 },
    { month: "Apr", length: 29 },
    { month: "May", length: 31 },
    { month: "Jun", length: 26 }
  ];

  const navItems = [
    { label: 'Home', href: 'indexafterlogin.html' },
    { label: 'About', href: 'aboutafterlogin.html' },
    { label: 'Blog', href: 'blogafterlogin.html' },
    { label: 'Track Your Periods', href: 'period-tracker.html' },
    { label: 'Diet Tracking', href: './diet' },
    { label: 'Recipe Suggestions', href: 'recipe-suggestions.html' },
    { label: 'Consultation', href: 'consultation.html' },
    { label: 'My Profile', href: 'dashboard.html', active: true }
  ];

  return (
    <main className="mt-4 bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="h-1 bg-yellow-500 fixed top-0 left-0 right-0 z-50" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 flex items-center justify-between p-4 bg-white z-40">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10">
            <img src="/api/placeholder/40/40" alt="Logo" className="h-full w-full" />
          </div>
          <div className="text-black">NutriLuna</div>
        </div>
        <div className="flex gap-5">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={`px-4 py-2 rounded-md transition-colors ${
                item.active ? 'bg-yellow-500 text-gray-900' : 'text-gray-900 hover:bg-yellow-500'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="grid grid-cols-3 gap-4 p-4 mt-16">
        {/* Left Content */}
        <div className="col-span-2 space-y-4">
          {/* Menstrual Health Tips */}
          <div className="bg-rose-50 rounded-lg p-4">
            <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Menstrual Health Tips</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  title: "Track Your Cycle",
                  description: "Keep a record of your menstrual cycle for better health management and predictions."
                },
                {
                  title: "Maintain Healthy Diet",
                  description: "A balanced diet rich in iron and vitamins helps manage menstrual symptoms."
                },
                {
                  title: "Stay Active",
                  description: "Exercise helps alleviate cramps and boosts overall well-being during menstruation."
                },
                {
                  title: "Relax & Manage Stress",
                  description: "Practice relaxation techniques such as yoga or meditation to reduce stress during your cycle."
                }
              ].map((tip, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold text-gray-700 mb-2">{tip.title}</h3>
                  <p className="text-gray-600 text-sm">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cycle Tracker */}
          <div className="bg-rose-50 rounded-lg p-4">
            <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Cycle Tracker</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { day: 15, cycleDay: 1, event: "Start of Period" },
                { day: 16, cycleDay: 2, event: "Heavy Flow" },
                { day: 17, cycleDay: 3, event: "Light Flow" }
              ].map((day, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow text-center">
                  <h3 className="text-2xl font-bold text-gray-700">{day.day}</h3>
                  <p className="text-gray-600">Day {day.cycleDay}</p>
                  <span className="text-sm text-gray-500">{day.event}</span>
                  <button className="mt-2 bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600">
                    Log Event
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Diet Tracking */}
          <div className="bg-rose-50 rounded-lg p-4">
            <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Diet Tracking</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[
                { title: "Calories Consumed", value: "1500 kcal" },
                { title: "Calories Burned", value: "1200 kcal" },
                { title: "Net Calories", value: "300 kcal" }
              ].map((stat, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow text-center">
                  <h3 className="font-semibold text-gray-700 mb-2">{stat.title}</h3>
                  <p className="text-xl text-red-700">{stat.value}</p>
                </div>
              ))}
            </div>
            <button className="w-full bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600">
              Add Meal
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className="space-y-4">
          {/* User Info */}
          <div className="bg-white rounded-lg p-4 shadow flex items-center justify-between">
            <div className="flex gap-4">
              <Bell className="w-6 h-6 text-gray-600" />
              <MessageSquare className="w-6 h-6 text-gray-600" />
            </div>
            <h4 className="text-lg font-semibold">Emma Johnson</h4>
            <img src="/api/placeholder/80/80" alt="Profile" className="w-20 h-20 rounded-full" />
          </div>

          {/* Cycle Statistics */}
          <div className="bg-rose-50 rounded-lg p-4">
            <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Cycle Statistics</h2>
            <div className="grid gap-4">
              {[
                { title: "Average Cycle Length", value: "28 days" },
                { title: "Longest Cycle", value: "31 days" },
                { title: "Shortest Cycle", value: "26 days" }
              ].map((stat, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold text-gray-700 mb-2">{stat.title}</h3>
                  <p className="text-lg text-red-700">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Period Chart */}
          <div className="bg-rose-50 rounded-lg p-4">
            <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Period Length Over Time</h2>
            <div className="bg-white p-4 rounded-lg shadow">
              <LineChart width={300} height={200} data={periodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="length" stroke="#DC2626" />
              </LineChart>
              <p className="text-sm text-gray-600 mt-2 text-center">
                This chart shows the cycle length over the past six months.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;