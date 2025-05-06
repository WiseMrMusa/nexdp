"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Create Stunning Event DPs
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
            Transform your events with professional display pictures. Choose from our curated templates and customize them to match your brand.
          </p>
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => router.push('/template-config')}
              className="px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
            >
              Get Started
            </button>
            <button 
              onClick={() => router.push('/template-config')}
              className="px-8 py-3 border border-purple-600 text-purple-600 rounded-full hover:bg-purple-50 transition-colors"
            >
              View Templates
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Beautiful Templates</h3>
            <p className="text-gray-600 dark:text-gray-300">Choose from hundreds of professionally designed templates for any occasion.</p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Customization</h3>
            <p className="text-gray-600 dark:text-gray-300">Customize colors, fonts, and layouts to match your event's theme.</p>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Download</h3>
            <p className="text-gray-600 dark:text-gray-300">Get your customized DP ready to share in seconds.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your Event DP?</h2>
          <p className="text-xl mb-8">Join thousands of event organizers who trust NexDP for their display pictures.</p>
          <button 
            onClick={() => router.push('/template-config')}
            className="px-8 py-3 bg-white text-purple-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            Start Creating Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
        <p>© 2024 NexDP. All rights reserved.</p>
      </footer>
    </div>
  );
}
