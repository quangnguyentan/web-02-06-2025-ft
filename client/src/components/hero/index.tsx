import { motion } from "framer-motion";
import * as React from "react";

export const Hero: React.FC = () => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white pt-24 pb-16 min-h-screen flex items-center"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
      <div className="lg:w-1/2 text-center lg:text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Learn a Language with AI-Powered SpeakUp
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-xl">
          Master your target language with personalized lessons, interactive
          conversations, and instant AI feedback.
        </p>
        <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
          <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
            Get Started
          </button>
          <button className="border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition">
            Try for Free
          </button>
        </div>
      </div>
      <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-64 h-64 bg-gray-300 rounded-full flex items-center justify-center text-4xl"
        >
          📚
        </motion.div>
      </div>
    </div>
  </motion.section>
);

export default Hero;
