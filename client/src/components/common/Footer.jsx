import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8 rounded-lg">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-gray-600">© 2025 Social App. All rights reserved.</p>
        <div className="flex justify-center mt-4 space-x-4">
          <a href="#" className="text-gray-500 hover:text-gray-700">
            Terms
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            Privacy
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            Help
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
