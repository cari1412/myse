import Link from 'next/link'
import { Twitter, Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-xl font-bold text-white">GradientSaaS</span>
            </Link>
            <p className="text-gray-400 mb-6">Build faster with beautiful gradients.</p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 glass-gradient rounded-lg flex items-center justify-center hover:scale-110 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 glass-gradient rounded-lg flex items-center justify-center hover:scale-110 transition">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 glass-gradient rounded-lg flex items-center justify-center hover:scale-110 transition">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 glass-gradient rounded-lg flex items-center justify-center hover:scale-110 transition">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Security</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#about" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">© 2024 GradientSaaS. All rights reserved.</p>
        </div>
      </div>
      <div className="h-1 gradient-animated"></div>
    </footer>
  )
}