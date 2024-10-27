import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">About PayEase</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300">Our Story</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300">Careers</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300">Press</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Products</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300">Personal</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300">Business</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300">Partners</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300">Help Center</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300">Blog</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300">Developers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-600 dark:text-indigo-400">Connect</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300">Twitter</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300">Facebook</Link></li>
              <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300">Instagram</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-indigo-100 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} PayEase. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="#" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}