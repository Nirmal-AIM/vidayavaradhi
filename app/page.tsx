"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  Users,
  FileText,
  ArrowRight,
  GraduationCap,
  Quote,
  LogIn,
  UserPlus,
  Target,
  Lightbulb,
  TrendingUp,
  Award,
} from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null)

  const userTypes = [
    {
      id: "learner",
      title: "Learner",
      description: "Discover personalized learning paths tailored to your goals and background",
      icon: GraduationCap,
      color: "bg-blue-600",
      features: ["AI-powered course recommendations", "NSQF certified programs", "Progress tracking"],
    },
    {
      id: "trainer",
      title: "Trainer",
      description: "Access tools and insights to enhance your teaching effectiveness",
      icon: Users,
      color: "bg-indigo-600",
      features: ["Student progress analytics", "Course management tools", "Teaching resources"],
    },
    {
      id: "policymaker",
      title: "Policy Maker",
      description: "Analyze educational trends and make data-driven policy decisions",
      icon: FileText,
      color: "bg-purple-600",
      features: ["Educational analytics", "Trend analysis", "Policy impact assessment"],
    },
  ]

  const motivationalQuotes = [
    {
      quote: "Skills are the currency of the future. Invest in yourself today.",
      category: "Skills",
      icon: Target,
    },
    {
      quote: "Your career is a journey, not a destination. Make every step count.",
      category: "Career",
      icon: TrendingUp,
    },
    {
      quote: "Dreams don't work unless you do. Start your learning journey now.",
      category: "Dreams",
      icon: Lightbulb,
    },
    {
      quote: "Education is the most powerful weapon to change the world.",
      category: "Education",
      icon: Award,
    },
  ]

  const features = [
    {
      title: "Multilingual Support",
      description: "Learn in your preferred language with comprehensive multilingual support",
      icon: "/icons/multilingual.svg",
    },
    {
      title: "Discovery Services",
      description: "Discover new opportunities and pathways tailored to your interests",
      icon: "/icons/discovery-service.svg",
    },
    {
      title: "Citizen-Centric Approach",
      description: "Designed with citizens at the center, ensuring accessibility for all",
      icon: "/icons/citizen-centric.svg",
    },
    {
      title: "Career-Focused Learning",
      description: "Every course is designed to enhance your career prospects and employability",
      icon: "/icons/career-focussed.svg",
    },
  ]

  const handleUserTypeSelect = (userType: string) => {
    setSelectedUserType(userType)
    // Navigate to respective flows
    if (userType === "learner") {
      window.location.href = "/learner/survey"
    } else if (userType === "trainer") {
      window.location.href = "/trainer/survey"
    } else if (userType === "policymaker") {
      window.location.href = "/policymaker/dashboard"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
                <BookOpen className="h-6 sm:h-7 w-6 sm:w-7" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">VidyaVaradhi</h1>
                <p className="text-xs sm:text-sm text-slate-600">{"Empowering Indian Education"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                onClick={() => (window.location.href = "/login")}
              >
                <LogIn className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Sign In</span>
                <span className="xs:hidden">Login</span>
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                onClick={() => document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" })}
              >
                <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Get Started</span>
                <span className="xs:hidden">Start</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Banner Images */}
      <section className="relative overflow-hidden py-10">
        {/* Background gradient elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-white z-0"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4 md:space-y-6">
                <div className="inline-block px-3 md:px-4 py-1 md:py-1.5 bg-blue-100 rounded-full text-blue-700 font-medium text-xs md:text-sm mb-2">
                  Transforming Education in India
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 text-balance leading-tight">
                  {"Empowering Minds for an "}
                  <span className="text-blue-600 relative">
                    AI-Driven Future
                    <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100 -z-10 transform -rotate-1"></span>
                  </span>
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-slate-600 text-pretty leading-relaxed">
                  {
                    "VidyaVaradhi connects learners, trainers, and policymakers through intelligent recommendations based on NSQF standards, creating personalized pathways for educational excellence."
                  }
                </p>
              </div>

              <div className="flex flex-col xs:flex-row gap-3 md:gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 md:px-8 py-2 md:py-3 rounded-xl shadow-lg hover:shadow-blue-200/50 transition-all duration-300 transform hover:-translate-y-1 text-sm md:text-base"
                  onClick={() => document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Start Learning Journey
                  <ArrowRight className="ml-1 md:ml-2 h-4 md:h-5 w-4 md:w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 px-4 sm:px-6 md:px-8 py-2 md:py-3 rounded-xl bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 text-sm md:text-base"
                  onClick={() => (window.location.href = "/login")}
                >
                  <LogIn className="mr-1 md:mr-2 h-4 md:h-5 w-4 md:w-5" />
                  Sign In
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-transform hover:scale-[1.02] duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent z-10"></div>
                <Image
                  src="/images/skillindia-banner.jpg"
                  alt="SOAR - Skilling for AI Readiness"
                  width={600}
                  height={300}
                  className="w-full h-auto"
                  priority
                />
              </div>
              <div className="relative mt-6 rounded-2xl overflow-hidden shadow-xl transform transition-transform hover:scale-[1.02] duration-500 translate-x-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent z-10"></div>
                <Image
                  src="/images/skillindia-success.jpg"
                  alt="National Apprenticeship Promotion Scheme - Your First Step to Success"
                  width={600}
                  height={300}
                  className="w-full h-auto"
                />
              </div>
              
            </div>
          </div>
        </div>
      </section>

       {/* Skills Qualification Frameworks Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">{"National Skills Framework"}</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {"Our programs are aligned with national standards to ensure quality education and recognized certifications."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
               <div className="relative rounded-2xl overflow-hidden shadow-xl transform transition-transform hover:scale-[1.02] duration-500">
                 <Image
                   src="/images/NSQF.jpeg"
                   alt="National Skills Qualification Frameworks"
                   width={600}
                   height={300}
                   className="w-full h-auto"
                 />
               </div>
             </div>
             <div className="flex justify-center">
               <div className="relative rounded-2xl overflow-hidden shadow-xl transform transition-transform hover:scale-[1.02] duration-500">
                 <Image
                   src="/images/NCVET.jpg"
                   alt="National Council for Vocational Education and Training"
                   width={600}
                   height={300}
                   className="w-full h-auto"
                 />
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Motivational Quotes Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">{"Inspiration for Your Journey"}</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {"Let these words of wisdom guide you on your path to success and personal growth."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {motivationalQuotes.map((item, index) => {
              const IconComponent = item.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 border-slate-200 bg-white/80"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-3">
                          <Quote className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                          <p className="text-sm text-slate-700 italic leading-relaxed">{item.quote}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
      
     

      {/* User Type Selection */}
      <section id="get-started" className="py-16 relative overflow-hidden">
        <div className="absolute top-40 right-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">{"Choose Your Role to Get Started"}</h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                {"Select your role to access personalized features and content tailored to your needs."}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {userTypes.map((userType, index) => {
                const IconComponent = userType.icon
                return (
                  <Card
                    key={userType.id}
                    className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-blue-300 bg-white/80 animate-fade-in"
                    onClick={() => handleUserTypeSelect(userType.id)}
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <CardHeader className="text-center pb-4">
                      <div
                        className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${userType.color} text-white shadow-lg transition-transform group-hover:scale-110`}
                      >
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-slate-900">{userType.title}</CardTitle>
                      <CardDescription className="text-slate-600">{userType.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2 mb-6">
                        {userType.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-slate-600">
                            <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 hover-pulse bg-transparent text-slate-700 border-slate-300"
                        variant="outline"
                      >
                        {"Get Started"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">{"Why Choose VidyaVaradhi?"}</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {
                "Our platform leverages cutting-edge AI to provide personalized educational experiences aligned with Indian educational standards."
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center group hover:shadow-lg transition-all duration-300 border-slate-200 bg-white/80"
              >
                <CardContent className="pt-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Image
                      src={feature.icon || "/placeholder.svg"}
                      alt={feature.title}
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  </div>
                  <h4 className="font-semibold mb-2 text-slate-900">{feature.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "AI-Powered Recommendations",
                desc: "Personalized learning paths based on your profile",
                icon: "🤖",
              },
              { title: "NSQF Compliance", desc: "139 certified courses across Electronics and IT", icon: "📜" },
              { title: "Progress Tracking", desc: "Monitor your learning journey with detailed analytics", icon: "📊" },
              { title: "Secure & Private", desc: "Your data is protected with enterprise-grade security", icon: "🔒" },
            ].map((feature, index) => (
              <Card
                key={index}
                className="text-center group hover:shadow-lg transition-all duration-300 border-slate-200 bg-white/80"
              >
                <CardContent className="pt-6">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h4 className="font-semibold mb-2 text-slate-900">{feature.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold text-white">{"Ready to Transform Your Future?"}</h3>
            <p className="text-xl text-blue-100">
              {
                "Join thousands of learners who are already building their careers with VidyaVaradhi's AI-powered education platform."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3"
                onClick={() => document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth" })}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 bg-transparent"
                onClick={() => (window.location.href = "/login")}
              >
                Sign In to Continue
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
