"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Cpu, Zap, BookOpen, Award, Clock, ArrowRight, CheckCircle } from "lucide-react"

interface Course {
  id: string
  title: string
  domain: "electronics" | "it"
  credits: number
  modules: Module[]
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  description: string
}

interface Module {
  id: string
  title: string
  credits: number
  duration: string
  topics: string[]
}

export default function AIRecommendation() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [userData, setUserData] = useState<any>(null)

  const analysisSteps = [
    { title: "Analyzing Academic Background", icon: BookOpen },
    { title: "Evaluating Skills & Experience", icon: Zap },
    { title: "Processing Learning Preferences", icon: Brain },
    { title: "Matching NSQF Courses", icon: Cpu },
    { title: "Generating Personalized Path", icon: Award },
  ]

  useEffect(() => {
    // Get user data
    const data = localStorage.getItem("userData")
    if (data) {
      setUserData(JSON.parse(data))
    }

    // Simulate AI analysis
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setIsAnalyzing(false)
          generateRecommendations()
          return 100
        }
        return prev + 2
      })

      setCurrentStep((prev) => {
        const newStep = Math.floor((progress / 100) * analysisSteps.length)
        return Math.min(newStep, analysisSteps.length - 1)
      })
    }, 100)

    return () => clearInterval(timer)
  }, [progress])

  const generateRecommendations = () => {
    // Mock NSQF courses based on user preferences
    const courses: Course[] = [
      {
        id: "cs001",
        title: "Cybersecurity Fundamentals",
        domain: "it",
        credits: 50,
        duration: "6 months",
        difficulty: "Intermediate",
        description:
          "Comprehensive cybersecurity course covering network security, ethical hacking, and digital forensics.",
        modules: [
          {
            id: "cs001-m1",
            title: "Fundamentals of Operating Systems",
            credits: 10,
            duration: "4 weeks",
            topics: ["Linux basics", "Windows security", "System administration"],
          },
          {
            id: "cs001-m2",
            title: "Network Security Principles",
            credits: 12,
            duration: "5 weeks",
            topics: ["Firewalls", "VPN", "Network protocols"],
          },
          {
            id: "cs001-m3",
            title: "Ethical Hacking Techniques",
            credits: 15,
            duration: "6 weeks",
            topics: ["Penetration testing", "Vulnerability assessment", "Security tools"],
          },
          {
            id: "cs001-m4",
            title: "Digital Forensics",
            credits: 8,
            duration: "3 weeks",
            topics: ["Evidence collection", "Data recovery", "Investigation techniques"],
          },
          {
            id: "cs001-m5",
            title: "Security Compliance & Governance",
            credits: 5,
            duration: "2 weeks",
            topics: ["ISO 27001", "Risk management", "Security policies"],
          },
        ],
      },
      {
        id: "wd001",
        title: "Full Stack Web Development",
        domain: "it",
        credits: 45,
        duration: "5 months",
        difficulty: "Beginner",
        description: "Complete web development course from frontend to backend with modern technologies.",
        modules: [
          {
            id: "wd001-m1",
            title: "HTML, CSS & JavaScript Fundamentals",
            credits: 12,
            duration: "4 weeks",
            topics: ["HTML5", "CSS3", "JavaScript ES6+"],
          },
          {
            id: "wd001-m2",
            title: "React.js Development",
            credits: 15,
            duration: "5 weeks",
            topics: ["Components", "State management", "Hooks"],
          },
          {
            id: "wd001-m3",
            title: "Backend with Node.js",
            credits: 10,
            duration: "4 weeks",
            topics: ["Express.js", "APIs", "Database integration"],
          },
          {
            id: "wd001-m4",
            title: "Database Management",
            credits: 8,
            duration: "3 weeks",
            topics: ["SQL", "MongoDB", "Database design"],
          },
        ],
      },
      {
        id: "iot001",
        title: "IoT Systems Development",
        domain: "electronics",
        credits: 40,
        duration: "4 months",
        difficulty: "Intermediate",
        description: "Internet of Things development covering hardware, software, and cloud integration.",
        modules: [
          {
            id: "iot001-m1",
            title: "Microcontroller Programming",
            credits: 12,
            duration: "4 weeks",
            topics: ["Arduino", "Raspberry Pi", "Embedded C"],
          },
          {
            id: "iot001-m2",
            title: "Sensor Integration",
            credits: 10,
            duration: "3 weeks",
            topics: ["Temperature sensors", "Motion detection", "Data acquisition"],
          },
          {
            id: "iot001-m3",
            title: "Wireless Communication",
            credits: 10,
            duration: "3 weeks",
            topics: ["WiFi", "Bluetooth", "LoRa", "5G"],
          },
          {
            id: "iot001-m4",
            title: "Cloud Integration",
            credits: 8,
            duration: "2 weeks",
            topics: ["AWS IoT", "Azure IoT", "Data analytics"],
          },
        ],
      },
    ]

    setRecommendedCourses(courses)
    setSelectedCourse(courses[0]) // Auto-select first course
  }

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course)
  }

  const proceedToDashboard = () => {
    // Save selected course
    if (selectedCourse) {
      const updatedUserData = {
        ...userData,
        selectedCourse,
        enrollmentDate: new Date().toISOString(),
        currentModule: selectedCourse.modules[0],
        progress: 0,
      }
      localStorage.setItem("userData", JSON.stringify(updatedUserData))
    }

    router.push("/learner/dashboard")
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-700">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg bg-white/90">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 via-indigo-600 to-blue-900 text-white">
                  <Brain className="h-8 w-8 animate-pulse" />
                </div>
                <CardTitle className="text-2xl text-balance text-indigo-900">{"AI is Analyzing Your Profile"}</CardTitle>
                <CardDescription className="text-pretty text-blue-900/80">
                  {
                    "Our intelligent system is processing your information to create personalized learning recommendations"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-900">{"Analysis Progress"}</span>
                    <span className="text-sm text-blue-900/80">{`${Math.round(progress)}%`}</span>
                  </div>
                  <Progress value={progress} className="h-3 bg-blue-200" />
                </div>

                <div className="space-y-3">
                  {analysisSteps.map((step, index) => {
                    const IconComponent = step.icon
                    const isActive = index === currentStep
                    const isCompleted = index < currentStep

                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-200 border border-indigo-300 shadow-sm"
                            : isCompleted
                              ? "bg-blue-50"
                              : "bg-blue-100"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                            isCompleted
                              ? "bg-gradient-to-br from-blue-700 via-indigo-600 to-blue-900 text-white"
                              : isActive
                                ? "bg-blue-200 text-indigo-900"
                                : "bg-blue-100 text-blue-900"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <IconComponent className={`h-5 w-5 ${isActive ? "animate-pulse" : ""}`} />
                          )}
                        </div>
                        <span
                          className={`font-medium ${
                            isActive ? "text-indigo-900" : isCompleted ? "text-blue-900" : "text-blue-700"
                          }`}
                        >
                          {step.title}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-700">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-balance text-white drop-shadow">{"Your Personalized Learning Path"}</h1>
            <p className="text-blue-100 text-pretty">
              {"Based on your profile, we've curated the perfect NSQF-certified courses for your career goals"}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Selection */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-xl font-semibold text-white">{"Recommended Courses"}</h2>
              {recommendedCourses.map((course) => (
                <Card
                  key={course.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedCourse?.id === course.id
                      ? "border-indigo-500 bg-blue-100 shadow-sm"
                      : "hover:border-indigo-400"
                  }`}
                  onClick={() => handleCourseSelect(course)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight text-indigo-900">{course.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={course.domain === "it" ? "default" : "secondary"}>
                            {course.domain === "it" ? "IT" : "Electronics"}
                          </Badge>
                          <Badge variant="outline">{course.difficulty}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-900">{course.credits}</div>
                        <div className="text-xs text-blue-900/80">{"credits"}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {course.modules.length} modules
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Course Details */}
            <div className="lg:col-span-2">
              {selectedCourse && (
                <Card className="shadow-lg bg-white/95">
                  <CardHeader>
                    <CardTitle className="text-2xl text-balance text-indigo-900">{selectedCourse.title}</CardTitle>
                    <CardDescription className="text-base text-pretty text-blue-900/80">{selectedCourse.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-100 rounded-lg">
                        <div className="text-2xl font-bold text-indigo-900">{selectedCourse.credits}</div>
                        <div className="text-sm text-blue-900/80">{"Total Credits"}</div>
                      </div>
                      <div className="text-center p-3 bg-blue-100 rounded-lg">
                        <div className="text-2xl font-bold text-indigo-900">{selectedCourse.modules.length}</div>
                        <div className="text-sm text-blue-900/80">{"Modules"}</div>
                      </div>
                      <div className="text-center p-3 bg-blue-100 rounded-lg">
                        <div className="text-2xl font-bold text-indigo-900">{selectedCourse.duration}</div>
                        <div className="text-sm text-blue-900/80">{"Duration"}</div>
                      </div>
                      <div className="text-center p-3 bg-blue-100 rounded-lg">
                        <div className="text-2xl font-bold text-indigo-900">{selectedCourse.difficulty}</div>
                        <div className="text-sm text-blue-900/80">{"Level"}</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">{"Learning Path"}</h3>
                      <div className="space-y-4">
                        {selectedCourse.modules.map((module, index) => (
                          <div key={module.id} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 via-indigo-600 to-blue-900 text-white text-sm font-medium shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2 gap-2">
                                <h4 className="font-medium leading-tight">{module.title}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                                  <Badge variant="outline">{module.credits} credits</Badge>
                                  <span>{module.duration}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {module.topics.map((topic, topicIndex) => (
                                  <Badge key={topicIndex} variant="secondary" className="text-xs bg-blue-200 text-blue-900">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-200 border border-indigo-300 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-5 w-5 text-indigo-900" />
                        <span className="font-medium text-indigo-900">{"NSQF Certification"}</span>
                      </div>
                      <p className="text-sm text-blue-900/80 leading-relaxed">
                        {
                          "Upon successful completion, you'll receive a nationally recognized NSQF certificate that's valued by employers across India."
                        }
                      </p>
                    </div>

                    <Button onClick={proceedToDashboard} className="w-full bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-900 text-white hover:brightness-110" size="lg">
                      {"Start Learning Journey"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
