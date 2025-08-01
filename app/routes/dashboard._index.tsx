import React, { useState, useEffect } from "react";
import { Link, useLocation } from "@remix-run/react";
import {
  Users,
  Calendar,
  ChefHat,
  Package,
  FileText,
  Menu,
  Star,
  Clock,
  Award,
  TrendingUp,
} from "lucide-react";

const Dashboard_Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navigationTabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <TrendingUp className="w-5 h-5" />,
      to: "/dashboard",
    },
    {
      id: "customers",
      label: "Customers",
      icon: <Users className="w-5 h-5" />,
      to: "/dashboard/customers",
    },
    {
      id: "events",
      label: "Events",
      icon: <Calendar className="w-5 h-5" />,
      to: "/dashboard/events",
    },
    {
      id: "menu-management",
      label: "Menu Management",
      icon: <ChefHat className="w-5 h-5" />,
      to: "/dashboard/menumgt",
    },
    {
      id: "ingredients",
      label: "Ingredients",
      icon: <Package className="w-5 h-5" />,
      to: "/dashboard/ingredients_inventory",
    },
    {
      id: "boq-generated",
      label: "BoQ Generated",
      icon: <FileText className="w-5 h-5" />,
      to: "/dashboard/boqs",
    },
  ];

  const services = [
    {
      name: "Corporate Events",
      description:
        "Professional catering for business meetings, conferences, and corporate gatherings",
      icon: "🏢",
    },
    {
      name: "Wedding Catering",
      description:
        "Elegant dining experiences for your special day with customized menus",
      icon: "💒",
    },
    {
      name: "Private Parties",
      description:
        "Intimate gatherings and celebrations with personalized service",
      icon: "🎉",
    },
    {
      name: "Buffet Services",
      description: "Extensive buffet setups for large gatherings and events",
      icon: "🍽️",
    },
    {
      name: "Delivery & Takeout",
      description:
        "Fresh meals delivered to your location with quality packaging",
      icon: "🚚",
    },
    {
      name: "Custom Menus",
      description:
        "Tailored culinary experiences based on dietary preferences and themes",
      icon: "📋",
    },
  ];

  const stats = [
    { label: "Total Events", value: "247", growth: "+12%" },
    { label: "Active Customers", value: "89", growth: "+8%" },
    { label: "Menu Items", value: "156", growth: "+5%" },
    { label: "Monthly Revenue", value: "$45,230", growth: "+15%" },
  ];

  const foodEmojis = [
    "🍎",
    "🥕",
    "🥬",
    "🍅",
    "🥒",
    "🧄",
    "🧅",
    "🥔",
    "🌶️",
    "🥦",
    "🍖",
    "🍗",
    "🥩",
    "🍞",
    "🧀",
    "🥛",
    "🍚",
    "🍝",
    "🍕",
    "🥗",
  ];

  const FloatingFood = ({ emoji, delay }) => {
    const [position, setPosition] = useState({
      x: Math.random() * 100,
      y: Math.random() * 100,
    });

    useEffect(() => {
      const interval = setInterval(() => {
        setPosition((prev) => ({
          x: (prev.x + 0.2) % 100,
          y: prev.y + Math.sin(Date.now() * 0.001 + delay) * 0.1,
        }));
      }, 100);
      return () => clearInterval(interval);
    }, [delay]);

    return (
      <div
        className="absolute text-2xl opacity-20 pointer-events-none transition-all duration-1000"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: `translate(-50%, -50%) rotate(${
            Math.sin(Date.now() * 0.002 + delay) * 10
          }deg)`,
          animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
        }}
      >
        {emoji}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-2xl border border-orange-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl tracking-tighter font-bold text-gray-800 mb-2">
                    Welcome to Oleander Catering Solutions
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {currentTime.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    • {currentTime.toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-6xl animate-bounce">🍽️</div>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Your comprehensive Bill of Quantity management system for
                premium catering services. Streamline your operations, manage
                ingredients efficiently, and deliver exceptional culinary
                experiences with precision and style.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </h3>
                    <span className="text-green-600 text-sm font-semibold">
                      {stat.growth}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* About Section */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <ChefHat className="w-8 h-8 text-orange-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">
                  About Our Catering Service
                </h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                With over 15 years of culinary excellence, Gourmet Catering
                Solutions has been the trusted partner for memorable events
                across the region. We specialize in creating bespoke dining
                experiences that combine exceptional flavors with impeccable
                service, ensuring every occasion becomes extraordinary.
              </p>
              <div className="flex items-center space-x-8">
                <div className="flex items-center text-gray-700">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="font-semibold">4.9/5 Customer Rating</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Award className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="font-semibold">Certified Excellence</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 text-green-500 mr-2" />
                  <span className="font-semibold">24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Menu className="w-7 h-7 text-orange-600 mr-3" />
                Our Services
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-orange-50 hover:to-red-50 transition-all duration-300 border border-gray-200"
                  >
                    <div className="text-3xl mb-4">{service.icon}</div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {service.name}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* App Features */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                BoQ Application Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Customer Management
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Comprehensive customer database with event history
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Event Planning
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Detailed event scheduling and requirement tracking
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <ChefHat className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Menu Management
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Dynamic menu creation with ingredient tracking
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Inventory Control
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Real-time ingredient stock monitoring and alerts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        BoQ Generation
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Automated bill of quantity with precise cost
                        calculations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Analytics & Reports
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Comprehensive business insights and performance metrics
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white p-12 rounded-2xl shadow-lg border border-gray-100 text-center">
            <div className="text-6xl mb-6">🚧</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Coming Soon
            </h3>
            <p className="text-gray-600 text-lg">
              The {navigationTabs.find((tab) => tab.id === activeTab)?.label}{" "}
              section is currently under development.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {foodEmojis.map((emoji, index) => (
          <FloatingFood key={index} emoji={emoji} delay={index * 0.5} />
        ))}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <ChefHat className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tightest text-gray-800">
                    Oleander Catering Solutions
                  </h1>
                  <p className="text-sm text-gray-600">
                    Bill of Quantity Management System
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">Welcome back, Admin</div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200">
            <nav className="flex space-x-2 overflow-x-auto">
              {(() => {
                const location = useLocation();
                return navigationTabs.map((tab) =>
                  tab.id === "overview" ? (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ) : (
                    <Link
                      key={tab.id}
                      to={tab.to}
                      prefetch="intent"
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap ${
                        location.pathname === tab.to
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </Link>
                  )
                );
              })()}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-6 pb-12">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard_Index;
