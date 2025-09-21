"use client"

import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Shield,
  Lock,
  FileText,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Courses", href: "/courses" },
    { name: "Certifications", href: "/certifications" },
    { name: "Success Stories", href: "/success-stories" },
    { name: "Blog", href: "/blog" },
    { name: "Help Center", href: "/help" },
  ]

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy", icon: Shield },
    { name: "Terms of Service", href: "/terms", icon: FileText },
    { name: "Data Security", href: "/data-security", icon: Lock },
    { name: "Accessibility", href: "/accessibility", icon: Users },
  ]

  const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "LinkedIn", href: "#", icon: Linkedin },
    { name: "Instagram", href: "#", icon: Instagram },
  ]

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">VidyaVaradhi</h3>
                <p className="text-sm text-slate-400">Empowering Indian Education</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Transforming education through AI-powered personalized learning paths, connecting learners, trainers, and
              policymakers for a brighter future.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800"
                    asChild
                  >
                    <a href={social.href} aria-label={social.name}>
                      <IconComponent className="h-4 w-4" />
                    </a>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-white transition-colors duration-200 hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 mt-1 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm">Email</p>
                  <a href="mailto:support@vidyavaradhi.edu.in" className="text-sm hover:text-white transition-colors">
                    support@vidyavaradhi.edu.in
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-4 w-4 mt-1 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm">Phone</p>
                  <a href="tel:+911800123456" className="text-sm hover:text-white transition-colors">
                    +91 1800-123-456
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-1 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm">Address</p>
                  <p className="text-sm leading-relaxed">
                    Ministry of Skill Development
                    <br />& Entrepreneurship
                    <br />
                    New Delhi, India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Legal & Compliance</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => {
                const IconComponent = link.icon
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="flex items-center space-x-2 text-sm hover:text-white transition-colors duration-200 group"
                    >
                      <IconComponent className="h-3 w-3 text-blue-400 group-hover:text-blue-300" />
                      <span className="hover:underline">{link.name}</span>
                    </a>
                  </li>
                )
              })}
            </ul>

            {/* Compliance Badges */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-2 text-xs">
                <Shield className="h-3 w-3 text-green-400" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <Lock className="h-3 w-3 text-green-400" />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <FileText className="h-3 w-3 text-green-400" />
                <span>NSQF Aligned</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-800" />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-slate-400">
            <p>
              © {currentYear} VidyaVaradhi. All rights reserved. |
              <span className="ml-1">A Government of India Initiative</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span>🇮🇳 Made in India</span>
            <span>•</span>
            <span>Powered by AI</span>
            <span>•</span>
            <span>NSQF Certified</span>
            <span>•</span>
            <span>Secure & Private</span>
          </div>
        </div>
      </div>

      {/* Data Privacy Notice */}
      <div className="bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
            <Shield className="h-3 w-3 text-blue-400" />
            <span>
              Your privacy is our priority. We comply with all data protection regulations including GDPR and Indian IT
              Act.
            </span>
            <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline ml-1">
              Learn more
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
