"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, ArrowLeft, AlertCircle } from "lucide-react"

interface SurveyData {
  personalInfo: {
    name: string
    age: string
    location: string
    email: string
  }
  academicBackground: {
    education: string
    field: string
    institution: string
    yearCompleted: string
  }
  skillsAndExperience: {
    priorSkills: string[]
    workExperience: string
    techFamiliarity: string
  }
  socioEconomic: {
    employmentStatus: string
    incomeRange: string
    deviceAccess: string[]
    internetAccess: string
  }
  learningPreferences: {
    pace: string
    format: string
    timeAvailability: string
    motivation: string
  }
  aspirations: {
    careerGoals: string
    preferredDomain: string
    timeframe: string
    specificInterests: string
  }
}

export default function LearnerSurvey() {
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<string[]>([])
  const [surveyData, setSurveyData] = useState<SurveyData>(
    process.env.NODE_ENV === "development"
      ? {
          personalInfo: {
            name: "Test Learner",
            age: "22",
            location: "Hyderabad, Telangana",
            email: "nirmaldiploma@gmail.com",
          },
          academicBackground: {
            education: "bachelor",
            field: "Computer Science",
            institution: "ABC College",
            yearCompleted: "2024",
          },
          skillsAndExperience: {
            priorSkills: ["Programming", "Web Development"],
            workExperience: "1-3",
            techFamiliarity: "intermediate",
          },
          socioEconomic: {
            employmentStatus: "student",
            incomeRange: "0-10k",
            deviceAccess: ["Smartphone", "Laptop"],
            internetAccess: "good",
          },
          learningPreferences: {
            pace: "self-paced",
            format: "video",
            timeAvailability: "5-10",
            motivation: "Upskill for better job opportunities",
          },
          aspirations: {
            careerGoals: "Become a full-stack developer",
            preferredDomain: "it",
            timeframe: "6-12months",
            specificInterests: "Web Development, Data Science",
          },
        }
      : {
          personalInfo: { name: "", age: "", location: "", email: "" },
          academicBackground: { education: "", field: "", institution: "", yearCompleted: "" },
          skillsAndExperience: { priorSkills: [], workExperience: "", techFamiliarity: "" },
          socioEconomic: { employmentStatus: "", incomeRange: "", deviceAccess: [], internetAccess: "" },
          learningPreferences: { pace: "", format: "", timeAvailability: "", motivation: "" },
          aspirations: { careerGoals: "", preferredDomain: "", timeframe: "", specificInterests: "" },
        }
  )

  const totalSteps = 6

  const validateCurrentStep = (): boolean => {
    const newErrors: string[] = []

    switch (currentStep) {
      case 1: // Personal Information
        if (!surveyData.personalInfo.name.trim()) newErrors.push("Full name is required")
        if (!surveyData.personalInfo.age.trim()) newErrors.push("Age is required")
        if (!surveyData.personalInfo.location.trim()) newErrors.push("Location is required")
        if (!surveyData.personalInfo.email.trim()) {
          newErrors.push("Email address is required")
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(surveyData.personalInfo.email)) {
          newErrors.push("Please enter a valid email address")
        }
        break

      case 2: // Academic Background
        if (!surveyData.academicBackground.education) newErrors.push("Education level is required")
        if (!surveyData.academicBackground.field.trim()) newErrors.push("Field of study is required")
        if (!surveyData.academicBackground.institution.trim()) newErrors.push("Institution name is required")
        if (!surveyData.academicBackground.yearCompleted.trim()) newErrors.push("Year completed is required")
        break

      case 3: // Skills & Experience
        if (!surveyData.skillsAndExperience.workExperience) newErrors.push("Work experience is required")
        if (!surveyData.skillsAndExperience.techFamiliarity) newErrors.push("Technology familiarity is required")
        break

      case 4: // Socio-Economic Context
        if (!surveyData.socioEconomic.employmentStatus) newErrors.push("Employment status is required")
        if (!surveyData.socioEconomic.incomeRange) newErrors.push("Income range is required")
        if (surveyData.socioEconomic.deviceAccess.length === 0) newErrors.push("Please select at least one device")
        if (!surveyData.socioEconomic.internetAccess) newErrors.push("Internet access quality is required")
        break

      case 5: // Learning Preferences
        if (!surveyData.learningPreferences.pace) newErrors.push("Learning pace preference is required")
        if (!surveyData.learningPreferences.format) newErrors.push("Learning format preference is required")
        if (!surveyData.learningPreferences.timeAvailability) newErrors.push("Time availability is required")
        if (!surveyData.learningPreferences.motivation.trim()) newErrors.push("Learning motivation is required")
        break

      case 6: // Career Aspirations
        if (!surveyData.aspirations.careerGoals.trim()) newErrors.push("Career goals are required")
        if (!surveyData.aspirations.preferredDomain) newErrors.push("Preferred domain is required")
        if (!surveyData.aspirations.timeframe) newErrors.push("Timeline is required")
        if (!surveyData.aspirations.specificInterests.trim()) newErrors.push("Specific interests are required")
        break
    }

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return // Don't proceed if validation fails
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      setErrors([]) // Clear errors when moving to next step
    } else {
      // Submit survey and proceed to OTP verification
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors([]) // Clear errors when going back
    }
  }

  const handleSubmit = () => {
    // Store survey data and redirect to OTP verification
    localStorage.setItem("learnerSurveyData", JSON.stringify(surveyData))
    window.location.href = "/learner/verify-otp"
  }

  const updateSurveyData = (section: keyof SurveyData, field: string, value: any) => {
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
                <Label htmlFor="age">{"Age"}</Label>
                <Input
                  id="age"
                  type="number"
                  value={surveyData.personalInfo.age}
                  onChange={(e) => updateSurveyData("personalInfo", "age", e.target.value)}
                  placeholder="Enter your age"
                />
              </div>
              <div>
                <Label htmlFor="location">{"Location (City, State)"}</Label>
                <Input
                  id="location"
                  value={surveyData.personalInfo.location}
                  onChange={(e) => updateSurveyData("personalInfo", "location", e.target.value)}
                  placeholder="e.g., Mumbai, Maharashtra"
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
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{"Academic Background"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="education">{"Highest Education Level"}</Label>
                <Select onValueChange={(value) => updateSurveyData("academicBackground", "education", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10th">{"10th Standard"}</SelectItem>
                    <SelectItem value="12th">{"12th Standard"}</SelectItem>
                    <SelectItem value="diploma">{"Diploma"}</SelectItem>
                    <SelectItem value="bachelor">{"Bachelor's Degree"}</SelectItem>
                    <SelectItem value="master">{"Master's Degree"}</SelectItem>
                    <SelectItem value="phd">{"PhD"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="field">{"Field of Study"}</Label>
                <Input
                  id="field"
                  value={surveyData.academicBackground.field}
                  onChange={(e) => updateSurveyData("academicBackground", "field", e.target.value)}
                  placeholder="e.g., Computer Science, Electronics"
                />
              </div>
              <div>
                <Label htmlFor="institution">{"Institution Name"}</Label>
                <Input
                  id="institution"
                  value={surveyData.academicBackground.institution}
                  onChange={(e) => updateSurveyData("academicBackground", "institution", e.target.value)}
                  placeholder="Name of your school/college"
                />
              </div>
              <div>
                <Label htmlFor="yearCompleted">{"Year Completed"}</Label>
                <Input
                  id="yearCompleted"
                  type="number"
                  value={surveyData.academicBackground.yearCompleted}
                  onChange={(e) => updateSurveyData("academicBackground", "yearCompleted", e.target.value)}
                  placeholder="e.g., 2023"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{"Skills & Experience"}</h3>
            <div>
              <Label>{"Prior Technical Skills (Select all that apply)"}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {[
                  "Programming",
                  "Web Development",
                  "Mobile Apps",
                  "Data Analysis",
                  "Networking",
                  "Cybersecurity",
                  "Digital Marketing",
                  "Graphic Design",
                ].map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={surveyData.skillsAndExperience.priorSkills.includes(skill)}
                      onCheckedChange={(checked) => {
                        const currentSkills = surveyData.skillsAndExperience.priorSkills
                        if (checked) {
                          updateSurveyData("skillsAndExperience", "priorSkills", [...currentSkills, skill])
                        } else {
                          updateSurveyData(
                            "skillsAndExperience",
                            "priorSkills",
                            currentSkills.filter((s) => s !== skill),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={skill} className="text-sm">
                      {skill}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="workExperience">{"Work Experience"}</Label>
              <Select onValueChange={(value) => updateSurveyData("skillsAndExperience", "workExperience", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select work experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{"No work experience"}</SelectItem>
                  <SelectItem value="0-1">{"0-1 years"}</SelectItem>
                  <SelectItem value="1-3">{"1-3 years"}</SelectItem>
                  <SelectItem value="3-5">{"3-5 years"}</SelectItem>
                  <SelectItem value="5+">{"5+ years"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{"Technology Familiarity"}</Label>
              <RadioGroup
                value={surveyData.skillsAndExperience.techFamiliarity}
                onValueChange={(value) => updateSurveyData("skillsAndExperience", "techFamiliarity", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner">{"Beginner - Basic computer skills"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">{"Intermediate - Comfortable with technology"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced">{"Advanced - Strong technical background"}</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{"Socio-Economic Context"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{"Employment Status"}</Label>
                <Select onValueChange={(value) => updateSurveyData("socioEconomic", "employmentStatus", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">{"Student"}</SelectItem>
                    <SelectItem value="employed">{"Employed"}</SelectItem>
                    <SelectItem value="unemployed">{"Unemployed"}</SelectItem>
                    <SelectItem value="self-employed">{"Self-employed"}</SelectItem>
                    <SelectItem value="freelancer">{"Freelancer"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{"Monthly Income Range"}</Label>
                <Select onValueChange={(value) => updateSurveyData("socioEconomic", "incomeRange", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select income range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-10k">{"₹0 - ₹10,000"}</SelectItem>
                    <SelectItem value="10k-25k">{"₹10,000 - ₹25,000"}</SelectItem>
                    <SelectItem value="25k-50k">{"₹25,000 - ₹50,000"}</SelectItem>
                    <SelectItem value="50k-100k">{"₹50,000 - ₹1,00,000"}</SelectItem>
                    <SelectItem value="100k+">{"₹1,00,000+"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>{"Device Access (Select all that apply)"}</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {["Smartphone", "Laptop", "Desktop", "Tablet"].map((device) => (
                  <div key={device} className="flex items-center space-x-2">
                    <Checkbox
                      id={device}
                      checked={surveyData.socioEconomic.deviceAccess.includes(device)}
                      onCheckedChange={(checked) => {
                        const currentDevices = surveyData.socioEconomic.deviceAccess
                        if (checked) {
                          updateSurveyData("socioEconomic", "deviceAccess", [...currentDevices, device])
                        } else {
                          updateSurveyData(
                            "socioEconomic",
                            "deviceAccess",
                            currentDevices.filter((d) => d !== device),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={device} className="text-sm">
                      {device}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>{"Internet Access Quality"}</Label>
              <RadioGroup
                value={surveyData.socioEconomic.internetAccess}
                onValueChange={(value) => updateSurveyData("socioEconomic", "internetAccess", value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excellent" id="excellent" />
                  <Label htmlFor="excellent">{"Excellent - High-speed broadband"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="good" />
                  <Label htmlFor="good">{"Good - Reliable connection"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="limited" id="limited" />
                  <Label htmlFor="limited">{"Limited - Occasional connectivity issues"}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="poor" id="poor" />
                  <Label htmlFor="poor">{"Poor - Frequent connectivity problems"}</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{"Learning Preferences"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{"Preferred Learning Pace"}</Label>
                <RadioGroup
                  value={surveyData.learningPreferences.pace}
                  onValueChange={(value) => updateSurveyData("learningPreferences", "pace", value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="self-paced" id="self-paced" />
                    <Label htmlFor="self-paced">{"Self-paced"}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="structured" id="structured" />
                    <Label htmlFor="structured">{"Structured with deadlines"}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intensive" id="intensive" />
                    <Label htmlFor="intensive">{"Intensive/Fast-track"}</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label>{"Preferred Learning Format"}</Label>
                <RadioGroup
                  value={surveyData.learningPreferences.format}
                  onValueChange={(value) => updateSurveyData("learningPreferences", "format", value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="video" id="video" />
                    <Label htmlFor="video">{"Video tutorials"}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="text" id="text" />
                    <Label htmlFor="text">{"Text-based content"}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="interactive" id="interactive" />
                    <Label htmlFor="interactive">{"Interactive exercises"}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mixed" id="mixed" />
                    <Label htmlFor="mixed">{"Mixed format"}</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div>
              <Label>{"Time Availability per Week"}</Label>
              <Select onValueChange={(value) => updateSurveyData("learningPreferences", "timeAvailability", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">{"1-5 hours"}</SelectItem>
                  <SelectItem value="5-10">{"5-10 hours"}</SelectItem>
                  <SelectItem value="10-20">{"10-20 hours"}</SelectItem>
                  <SelectItem value="20+">{"20+ hours"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="motivation">{"What motivates you to learn?"}</Label>
              <Textarea
                id="motivation"
                value={surveyData.learningPreferences.motivation}
                onChange={(e) => updateSurveyData("learningPreferences", "motivation", e.target.value)}
                placeholder="Describe your learning motivation..."
                rows={3}
              />
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{"Career Aspirations"}</h3>
            <div>
              <Label htmlFor="careerGoals">{"Career Goals"}</Label>
              <Textarea
                id="careerGoals"
                value={surveyData.aspirations.careerGoals}
                onChange={(e) => updateSurveyData("aspirations", "careerGoals", e.target.value)}
                placeholder="Describe your career goals and aspirations..."
                rows={3}
              />
            </div>
            <div>
              <Label>{"Preferred Domain"}</Label>
              <Select onValueChange={(value) => updateSurveyData("aspirations", "preferredDomain", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">{"Electronics (66 courses)"}</SelectItem>
                  <SelectItem value="it">{"Information Technology (73 courses)"}</SelectItem>
                  <SelectItem value="both">{"Both Electronics & IT"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{"Timeline to Achieve Goals"}</Label>
              <Select onValueChange={(value) => updateSurveyData("aspirations", "timeframe", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3-6months">{"3-6 months"}</SelectItem>
                  <SelectItem value="6-12months">{"6-12 months"}</SelectItem>
                  <SelectItem value="1-2years">{"1-2 years"}</SelectItem>
                  <SelectItem value="2+years">{"2+ years"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="specificInterests">{"Specific Areas of Interest"}</Label>
              <Textarea
                id="specificInterests"
                value={surveyData.aspirations.specificInterests}
                onChange={(e) => updateSurveyData("aspirations", "specificInterests", e.target.value)}
                placeholder="e.g., Cybersecurity, Web Development, IoT, Data Science..."
                rows={3}
              />
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
              <h2 className="text-2xl font-bold">{"Learner Profile Survey"}</h2>
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
              <CardTitle>{"Help us understand your learning profile"}</CardTitle>
              <CardDescription>
                {"This information will help our AI recommend the most suitable learning paths for you."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderStep()}

              {/* Error Display */}
              {errors.length > 0 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium">Please fix the following errors:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {errors.map((error, index) => (
                          <li key={index} className="text-sm">
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {"Previous"}
                </Button>
                <Button onClick={handleNext}>
                  {currentStep === totalSteps ? "Submit Survey" : "Next"}
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
