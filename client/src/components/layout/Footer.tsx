import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 font-poppins text-primary">
              CIVICAMP
            </h3>
            <p className="text-gray-600 text-sm">
              Connecting citizens with local authorities for transparent
              governance and community development.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="text-gray-600 hover:text-primary">About Us</a>
              </li>
              <li>
                <a href="/how-it-works" className="text-gray-600 hover:text-primary">How It Works</a>
              </li>
              <li>
                <a href="/success-stories" className="text-gray-600 hover:text-primary">Success Stories</a>
              </li>
              <li>
                <a href="/faq" className="text-gray-600 hover:text-primary">FAQ</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/open-data" className="text-gray-600 hover:text-primary">Open Data</a>
              </li>
              <li>
                <a href="/api-docs" className="text-gray-600 hover:text-primary">API Documentation</a>
              </li>
              <li>
                <a href="/govt-portals" className="text-gray-600 hover:text-primary">Government Portals</a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-gray-600 hover:text-primary">Privacy Policy</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Connect With Us</h4>
            <div className="flex space-x-4 mb-4">
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition"
                aria-label="Facebook"
              >
                <i className="ri-facebook-fill"></i>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition"
                aria-label="Twitter"
              >
                <i className="ri-twitter-fill"></i>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition"
                aria-label="Instagram"
              >
                <i className="ri-instagram-line"></i>
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition"
                aria-label="LinkedIn"
              >
                <i className="ri-linkedin-fill"></i>
              </a>
            </div>
            <p className="text-sm text-gray-600">Download our mobile app</p>
            <div className="flex space-x-2 mt-2">
              <a href="#" className="block">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/320px-Google_Play_Store_badge_EN.svg.png"
                  alt="Get it on Google Play"
                  className="h-8"
                />
              </a>
              <a href="#" className="block">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/320px-Download_on_the_App_Store_Badge.svg.png"
                  alt="Download on App Store"
                  className="h-8"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} CIVICAMP. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-sm">
              <li>
                <a href="/terms" className="text-gray-600 hover:text-primary">Terms</a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-600 hover:text-primary">Privacy</a>
              </li>
              <li>
                <a href="/cookies" className="text-gray-600 hover:text-primary">Cookies</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
