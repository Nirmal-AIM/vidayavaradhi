"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, ArrowLeft } from "lucide-react"

interface TrainerSurveyData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
  }
  professionalBackground: {
    experience: string
    currentRole: string
    institution: string
    qualifications: string[]
    specializations: string[]
  }
  teachingExperience: {
    yearsTeaching: string
    studentsHandled: string
    coursesDelivered: string[]
    teachingMethods: string[]
    onlineExperience: string
  }
  technicalSkills: {
    domains: string[]
    certifications: string[]
    toolsProficiency: string[]
    industryExperience: string
  }
  preferences: {
    preferredStudentLevel: string[]
    batchSize: string
    availableHours: string
    supportNeeds: string[]
  }
}

export default function TrainerSurvey() {
  const [currentStep, setCurrentStep] = useState(1)
  const [surveyData, setSurveyData] = useState<TrainerSurveyData>(
    process.env.NODE_ENV === "development"
      ? {
          personalInfo: {
            name: "Test Trainer",
            email: "trainer@example.com",
            phone: "+91 9876543210",
            location: "Bangalore, Karnataka",
          },
          professionalBackground: {
            experience: "5-10",
            currentRole: "Senior Trainer",
            institution: "XYZ Institute",
            qualifications: ["Master's Degree", "Professional Certification"],
            specializations: ["Software Development", "Data Science"],
          },
          teachingExperience: {
            yearsTeaching: "5-10",
            studentsHandled: "100-500",
            coursesDelivered: ["Web Development", "Data Science"],
            teachingMethods: ["Classroom Teaching", "Online Teaching"],
            onlineExperience: "intermediate",
          },
          technicalSkills: {
            domains: ["Programming Languages", "Web Technologies"],
            certifications: ["AWS Certified", "Microsoft Certified"],
            toolsProficiency: ["VS Code", "Jupyter"],
            industryExperience: "corporate",
          },
          preferences: {
            preferredStudentLevel: ["Beginner", "Intermediate"],
            batchSize: "15-30",
            availableHours: "10-20",
            supportNeeds: ["Teaching Materials", "Technical Support"],
          },
        }
      : {
          personalInfo: { name: "", email: "", phone: "", location: "" },
          professionalBackground: {
            experience: "",
            currentRole: "",
            institution: "",
            qualifications: [],
            specializations: [],
          },
          teachingExperience: {
            yearsTeaching: "",
            studentsHandled: "",
            coursesDelivered: [],
            teachingMethods: [],
            onlineExperience: "",
          },
          technicalSkills: { domains: [], certifications: [], toolsProficiency: [], industryExperience: "" },
          preferences: { preferredStudentLevel: [], batchSize: "", availableHours: "", supportNeeds: [] },
        }
  )

  const totalSteps = 5

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Store trainer data and redirect to dashboard
    const trainerData = {
      ...surveyData,
      userType: "trainer",
      registrationDate: new Date().toISOString(),
      trainerId: generateTrainerId(),
    }
    localStorage.setItem("trainerData", JSON.stringify(trainerData))
    window.location.href = "/trainer/dashboard"
  }

  const generateTrainerId = () => {
    const year = new Date().getFullYear().toString().slice(-2)
    const month = String(new Date().getMonth() + 1).padStart(2, "0")
    const random = Math.floor(Math.random() * 999)
      .toString()
      .padStart(3, "0")
    return `TR${year}${month}${random}`
  }

  const updateSurveyData = (section: keyof TrainerSurveyData, field: string, value: any) => {
    setSurveyData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{"Personal Information"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{"Full Name"}</Label>
                <Input
                  id="name"
                  value={surveyData.personalInfo.name}
                  onChange={(e) => updateSurveyData("personalInfo", "name", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">{"Email Address"}</Label>
                <Input
                  id="email"
                  type="email"
                  value={surveyData.personalInfo.email}
                  onChange={(e) => updateSurveyData("personalInfo", "email", e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">{"Phone Number"}</Label>
                <Input
                  id="phone"
                  value={surveyData.personalInfo.phone}
                  onChange={(e) => updateSurveyData("personalInfo", "phone", e.target.value)}
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <Label htmlFor="location">{"Location (City, State)"}</Label>
                <Input
                  id="location"
                  value={surveyData.personalInfo.location}
                  onChange={(e) => updateSurveyData("personalInfo", "location", e.target.value)}
                  placeholder="e.g., Bangalore, Karnataka"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{"Professional Background"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{"Total Professional Experience"}</Label>
                <Select onValueChange={(value) => updateSurveyData("professionalBackground", "experience", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-3">{"1-3 years"}</SelectItem>
                    <SelectItem value="3-5">{"3-5 years"}</SelectItem>
                    <SelectItem value="5-10">{"5-10 years"}</SelectItem>
                    <SelectItem value="10-15">{"10-15 years"}</SelectItem>
                    <SelectItem value="15+">{"15+ years"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="currentRole">{"Current Role/Position"}</Label>
                <Input
                  id="currentRole"
                  value={surveyData.professionalBackground.currentRole}
                  onChange={(e) => updateSurveyData("professionalBackground", "currentRole", e.target.value)}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="institution">{"Current Institution/Organization"}</Label>
                <Input
                  id="institution"
                  value={surveyData.professionalBackground.institution}
                  onChange={(e) => updateSurveyData("professionalBackground", "institution", e.target.value)}
                  placeholder="Name of your current workplace"
                />
              </div>
            </div>
            <div>
              <Label>{"Educational Qualifications (Select all that apply)"}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {["Bachelor's Degree", "Master's Degree", "PhD", "Professional Certification", "Diploma", "Other"].map(
                  (qual) => (
                    <div key={qual} className="flex items-center space-x-2">
                      <Checkbox
                        id={qual}
                        checked={surveyData.professionalBackground.qualifications.includes(qual)}
                        onCheckedChange={(checked) => {
                          const currentQuals = surveyData.professionalBackground.qualifications
                          if (checked) {
                            updateSurveyData("professionalBackground", "qualifications", [...currentQuals, qual])
                          } else {
                            updateSurveyData(
                              "professionalBackground",
                              "qualifications",
                              currentQuals.filter((q) => q !== qual),
                            )
                          }
                        }}
                      />
                      <Label htmlFor={qual} className="text-sm">
                        {qual}
                      </Label>
                    </div>
                  ),
                )}
              </div>
            </div>
            <div>
              <Label>{"Areas of Specialization (Select all that apply)"}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {[
                  "Software Development",
                  "Cybersecurity",
                  "Data Science",
                  "Web Development",
                  "Mobile Development",
                  "IoT",
                  "Electronics",
                  "Networking",
                ].map((spec) => (
                  <div key={spec} className="flex items-center space-x-2">
                    <Checkbox
                      id={spec}
                      checked={surveyData.professionalBackground.specializations.includes(spec)}
                      onCheckedChange={(checked) => {
                        const currentSpecs = surveyData.professionalBackground.specializations
                        if (checked) {
                          updateSurveyData("professionalBackground", "specializations", [...currentSpecs, spec])
                        } else {
                          updateSurveyData(
                            "professionalBackground",
                            "specializations",
                            currentSpecs.filter((s) => s !== spec),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={spec} className="text-sm">
                      {spec}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{"Teaching Experience"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{"Years of Teaching Experience"}</Label>
                <Select onValueChange={(value) => updateSurveyData("teachingExperience", "yearsTeaching", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teaching experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{"No teaching experience"}</SelectItem>
                    <SelectItem value="0-1">{"Less than 1 year"}</SelectItem>
                    <SelectItem value="1-3">{"1-3 years"}</SelectItem>
                    <SelectItem value="3-5">{"3-5 years"}</SelectItem>
                    <SelectItem value="5-10">{"5-10 years"}</SelectItem>
                    <SelectItem value="10+">{"10+ years"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{"Number of Students Handled"}</Label>
                <Select onValueChange={(value) => updateSurveyData("teachingExperience", "studentsHandled", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-10">{"0-10 students"}</SelectItem>
                    <SelectItem value="10-50">{"10-50 students"}</SelectItem>
                    <SelectItem value="50-100">{"50-100 students"}</SelectItem>
                    <SelectItem value="100-500">{"100-500 students"}</SelectItem>
                    <SelectItem value="500+">{"500+ students"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>{"Teaching Methods (Select all that apply)"}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {[
                  "Classroom Teaching",
                  "Online Teaching",
                  "Hands-on Labs",
                  "Project-based Learning",
                  "Mentoring",
                  "Workshop Facilitation",
                ].map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      id={method}
                      checked={surveyData.teachingExperience.teachingMethods.includes(method)}
                      onCheckedChange={(checked) => {
                        const currentMethods = surveyData.teachingExperience.teachingMethods
                        if (checked) {
                          updateSurveyData("teachingExperience", "teachingMethods", [...currentMethods, method])
                        } else {
                          updateSurveyData(
                            "teachingExperience",
                            "teachingMethods",
                            currentMethods.filter((m) => m !== method),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={method} className="text-sm">
                      {method}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>{"Online Teaching Experience"}</Label>
              <RadioGroup
                value={surveyData.teachingExperience.onlineExperience}
                onValueChange={(value) => updateSurveyData("teachingExperience", "onlineExperience", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none">{"No online teaching experience"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="basic" id="basic" />
                  <Label htmlFor="basic">{"Basic - Conducted a few online sessions"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">{"Intermediate - Regular online teaching"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expert" id="expert" />
                  <Label htmlFor="expert">{"Expert - Extensive online teaching experience"}</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{"Technical Skills & Certifications"}</h3>
            <div>
              <Label>{"Technical Domains (Select all that apply)"}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {[
                  "Programming Languages",
                  "Web Technologies",
                  "Database Management",
                  "Cloud Computing",
                  "DevOps",
                  "Machine Learning",
                  "Cybersecurity",
                  "Mobile Development",
                  "IoT",
                  "Electronics",
                ].map((domain) => (
                  <div key={domain} className="flex items-center space-x-2">
                    <Checkbox
                      id={domain}
                      checked={surveyData.technicalSkills.domains.includes(domain)}
                      onCheckedChange={(checked) => {
                        const currentDomains = surveyData.technicalSkills.domains
                        if (checked) {
                          updateSurveyData("technicalSkills", "domains", [...currentDomains, domain])
                        } else {
                          updateSurveyData(
                            "technicalSkills",
                            "domains",
                            currentDomains.filter((d) => d !== domain),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={domain} className="text-sm">
                      {domain}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>{"Professional Certifications (Select all that apply)"}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {[
                  "AWS Certified",
                  "Microsoft Certified",
                  "Google Cloud Certified",
                  "Cisco Certified",
                  "CompTIA Certified",
                  "Oracle Certified",
                  "Other Industry Certs",
                ].map((cert) => (
                  <div key={cert} className="flex items-center space-x-2">
                    <Checkbox
                      id={cert}
                      checked={surveyData.technicalSkills.certifications.includes(cert)}
                      onCheckedChange={(checked) => {
                        const currentCerts = surveyData.technicalSkills.certifications
                        if (checked) {
                          updateSurveyData("technicalSkills", "certifications", [...currentCerts, cert])
                        } else {
                          updateSurveyData(
                            "technicalSkills",
                            "certifications",
                            currentCerts.filter((c) => c !== cert),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={cert} className="text-sm">
                      {cert}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>{"Industry Experience"}</Label>
              <Select onValueChange={(value) => updateSurveyData("technicalSkills", "industryExperience", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startup">{"Startup Experience"}</SelectItem>
                  <SelectItem value="corporate">{"Corporate Experience"}</SelectItem>
                  <SelectItem value="consulting">{"Consulting Experience"}</SelectItem>
                  <SelectItem value="freelance">{"Freelance Experience"}</SelectItem>
                  <SelectItem value="mixed">{"Mixed Experience"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{"Teaching Preferences"}</h3>
            <div>
              <Label>{"Preferred Student Level (Select all that apply)"}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {["Beginner", "Intermediate", "Advanced", "Professional", "Students", "Working Professionals"].map(
                  (level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={level}
                        checked={surveyData.preferences.preferredStudentLevel.includes(level)}
                        onCheckedChange={(checked) => {
                          const currentLevels = surveyData.preferences.preferredStudentLevel
                          if (checked) {
                            updateSurveyData("preferences", "preferredStudentLevel", [...currentLevels, level])
                          } else {
                            updateSurveyData(
                              "preferences",
                              "preferredStudentLevel",
                              currentLevels.filter((l) => l !== level),
                            )
                          }
                        }}
                      />
                      <Label htmlFor={level} className="text-sm">
                        {level}
                      </Label>
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{"Preferred Batch Size"}</Label>
                <Select onValueChange={(value) => updateSurveyData("preferences", "batchSize", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">{"1-5 students (Individual/Small group)"}</SelectItem>
                    <SelectItem value="5-15">{"5-15 students (Small batch)"}</SelectItem>
                    <SelectItem value="15-30">{"15-30 students (Medium batch)"}</SelectItem>
                    <SelectItem value="30+">{"30+ students (Large batch)"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{"Available Hours per Week"}</Label>
                <Select onValueChange={(value) => updateSurveyData("preferences", "availableHours", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">{"1-5 hours"}</SelectItem>
                    <SelectItem value="5-10">{"5-10 hours"}</SelectItem>
                    <SelectItem value="10-20">{"10-20 hours"}</SelectItem>
                    <SelectItem value="20-40">{"20-40 hours"}</SelectItem>
                    <SelectItem value="40+">{"40+ hours (Full-time)"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>{"Support Needed (Select all that apply)"}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {[
                  "Curriculum Development",
                  "Teaching Materials",
                  "Assessment Tools",
                  "Student Management",
                  "Technical Support",
                  "Professional Development",
                ].map((support) => (
                  <div key={support} className="flex items-center space-x-2">
                    <Checkbox
                      id={support}
                      checked={surveyData.preferences.supportNeeds.includes(support)}
                      onCheckedChange={(checked) => {
                        const currentSupport = surveyData.preferences.supportNeeds
                        if (checked) {
                          updateSurveyData("preferences", "supportNeeds", [...currentSupport, support])
                        } else {
                          updateSurveyData(
                            "preferences",
                            "supportNeeds",
                            currentSupport.filter((s) => s !== support),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={support} className="text-sm">
                      {support}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold">{"Trainer Profile Survey"}</h2>
              <span className="text-sm text-muted-foreground">{`Step ${currentStep} of ${totalSteps}`}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Survey Form */}
          <Card>
            <CardHeader>
              <CardTitle>{"Help us understand your training expertise"}</CardTitle>
              <CardDescription>
                {"This information will help us match you with suitable learners and provide relevant resources."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {"Previous"}
                </Button>
                <Button onClick={handleNext}>
                  {currentStep === totalSteps ? "Complete Registration" : "Next"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
