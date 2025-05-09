import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  FiCompass,
  FiUsers,
  FiMessageCircle,
  FiImage,
  FiCoffee,
  FiHeart,
} from "react-icons/fi";
import BannerImg from "../../assets/banner.svg";

const Home = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const [randomQuote, setRandomQuote] = useState("");

  // Array of funny and motivational social media quotes
  const learningQuotes = [
    "Remember when we socialized in person? Yeah, me neither.",
    "Posting photos of food: Because if you didn't share it, did you even eat it?",
    "Social media: Where we all pretend our lives are perfect and believe everyone else's actually are.",
    "Warning: Excessive scrolling may cause thumb fatigue and FOMO.",
    "Your life is not defined by your follower count... but a few more wouldn't hurt.",
    "I came, I scrolled, I commented.",
    "Making connections is easy. Making meaningful ones is an art.",
    "Behind every great post is someone who deleted it 5 times before publishing.",
    "50% social, 50% media, 100% addictive.",
    "Friendships used to take years to develop. Now they take seconds to accept.",
  ];

  // Select a random quote on component mount and when the button is clicked
  useEffect(() => {
    getRandomQuote();
  }, []);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * learningQuotes.length);
    setRandomQuote(learningQuotes[randomIndex]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/feed" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 pt-16">
        <div className="flex flex-col md:flex-row items-center gap-8 py-24">
          {/* Left Column - Hero Text and Quote */}
          <div className="md:w-1/2 w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Connect with friends and the world around you
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Share your moments, discover new experiences, and build meaningful
              connections on our social platform.
            </p>

            {/* Fun Quote Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-7 rounded-lg border-l-4 border-blue-500 mb-8 relative">
              <p className="text-lg italic text-gray-700">{randomQuote}</p>
              <button
                onClick={getRandomQuote}
                className="absolute bottom-2 right-2 text-blue-500 text-sm hover:text-blue-700"
              >
                New quote
              </button>
            </div>
          </div>

          {/* Right Column - Images */}
          <div className="md:w-1/2 w-full">
            <img src={BannerImg} alt={BannerImg} />
          </div>
        </div>

        {/* How to Use This Application Section */}
        <div className="py-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            How to Use This Platform
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side: Tips with icons */}
            <div className="bg-white rounded-lg p-8 shadow-md">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Get Started in 4 Simple Steps
              </h3>

              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FiUsers className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Create Your Profile
                    </h4>
                    <p className="text-gray-600 mt-1">
                      Sign up with Google and personalize your profile with a
                      photo and bio that reflects your interests and
                      personality.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <FiCompass className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Discover and Connect
                    </h4>
                    <p className="text-gray-600 mt-1">
                      Find and follow friends, family, or people with shared
                      interests to build your personal network.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <FiImage className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Share Your Moments
                    </h4>
                    <p className="text-gray-600 mt-1">
                      Post photos, videos, and updates about your life to share
                      experiences with your connections.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="bg-orange-100 p-3 rounded-full mr-4">
                    <FiMessageCircle className="text-orange-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Engage and Interact
                    </h4>
                    <p className="text-gray-600 mt-1">
                      React to posts, leave thoughtful comments, and participate
                      in meaningful conversations.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right side: Tips and image */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 shadow-md flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-6 text-gray-800">
                  Pro Tips for Better Social Experience
                </h3>

                <ul className="space-y-4 mb-6">
                  <li className="flex items-start">
                    <FiHeart className="text-pink-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">
                      Be authentic — genuine content creates more meaningful
                      connections
                    </span>
                  </li>
                  <li className="flex items-start">
                    <FiUsers className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">
                      Quality over quantity — focus on building genuine
                      relationships
                    </span>
                  </li>
                  <li className="flex items-start">
                    <FiCoffee className="text-amber-600 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">
                      Take regular digital breaks — the real world has a lot to
                      offer too!
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-800">Remember</p>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Important
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Our platform is about creating a positive environment. Be
                  respectful, protect your privacy, and report any content that
                  violates our community guidelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
