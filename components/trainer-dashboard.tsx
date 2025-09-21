"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Users, BookOpen, TrendingUp, LogOut, MessageSquare, Calendar, Award } from "lucide-react"

export default function TrainerDashboard() {
  const [trainerData, setTrainerData] = useState<any>(null)

  useEffect(() => {
    // Get trainer data
    const data = localStorage.getItem("trainerData")
    if (data) {
      setTrainerData(JSON.parse(data))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("trainerData")
    window.location.href = "/login"
  }

  if (!trainerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{"Loading dashboard..."}</p>
        </div>
      </div>
    )
  }

  // Mock data for demonstration
  const mockStats = {
    totalStudents: 45,
    activeCourses: 3,
    completionRate: 87,
    avgRating: 4.6,
  }

  const mockStudents = [
    { name: "Rahul Sharma", course: "Cybersecurity", progress: 75, lastActive: "2 hours ago" },
    { name: "Priya Patel", course: "Web Development", progress: 60, lastActive: "1 day ago" },
    { name: "Amit Kumar", course: "IoT Systems", progress: 90, lastActive: "30 minutes ago" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{"VidyaVaradhi"}</h1>
                <p className="text-sm text-muted-foreground">{"Trainer Dashboard"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{trainerData.personalInfo.name}</p>
                <p className="text-sm text-muted-foreground">{trainerData.trainerId}</p>
              </div>
              <Avatar>
                <AvatarFallback>
                  <AvatarInitials name={trainerData.personalInfo.name} />
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {"Logout"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Welcome Section */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{"Total Students"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{mockStats.totalStudents}</div>
                <p className="text-sm text-muted-foreground">{"Across all courses"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{"Active Courses"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{mockStats.activeCourses}</div>
                <p className="text-sm text-muted-foreground">{"Currently teaching"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{"Completion Rate"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{mockStats.completionRate}%</div>
                <p className="text-sm text-muted-foreground">{"Student success rate"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{"Average Rating"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{mockStats.avgRating}/5</div>
                <p className="text-sm text-muted-foreground">{"Student feedback"}</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="students" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="students">{"My Students"}</TabsTrigger>
              <TabsTrigger value="courses">{"Courses"}</TabsTrigger>
              <TabsTrigger value="analytics">{"Analytics"}</TabsTrigger>
              <TabsTrigger value="profile">{"Profile"}</TabsTrigger>
            </TabsList>

            <TabsContent value="students" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{"Student Progress Overview"}</CardTitle>
                  <CardDescription>{"Monitor your students' learning progress and engagement"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockStudents.map((student, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Avatar>
                          <AvatarFallback>
                            <AvatarInitials name={student.name} />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{student.name}</h3>
                            <Badge variant="outline">{student.course}</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>{"Progress"}</span>
                              <span>{student.progress}%</span>
                            </div>
                            <Progress value={student.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">{"Last active: " + student.lastActive}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            {"Message"}
                          </Button>
                          <Button variant="outline" size="sm">
                            {"View Details"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="courses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{"Course Management"}</CardTitle>
                  <CardDescription>{"Manage your teaching assignments and course materials"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Cybersecurity Fundamentals", "Full Stack Web Development", "IoT Systems Development"].map(
                      (course, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                              <BookOpen className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium">{course}</h3>
                              <p className="text-sm text-muted-foreground">
                                {15 + index * 5} students • {5 + index} modules
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              {"Manage"}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              {"Schedule"}
                            </Button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{"Teaching Performance"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>{"Student Satisfaction"}</span>
                        <span className="font-medium">4.6/5</span>
                      </div>
                      <Progress value={92} />

                      <div className="flex items-center justify-between">
                        <span>{"Course Completion Rate"}</span>
                        <span className="font-medium">87%</span>
                      </div>
                      <Progress value={87} />

                      <div className="flex items-center justify-between">
                        <span>{"Student Engagement"}</span>
                        <span className="font-medium">94%</span>
                      </div>
                      <Progress value={94} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{"Recent Achievements"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Award className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{"Top Rated Trainer"}</p>
                          <p className="text-sm text-muted-foreground">{"Achieved 4.5+ rating this month"}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{"High Completion Rate"}</p>
                          <p className="text-sm text-muted-foreground">{"85%+ students completed courses"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{"Personal Information"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">{"Name"}</label>
                      <p className="text-sm text-muted-foreground">{trainerData.personalInfo.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">{"Trainer ID"}</label>
                      <p className="text-sm text-muted-foreground font-mono">{trainerData.trainerId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">{"Email"}</label>
                      <p className="text-sm text-muted-foreground">{trainerData.personalInfo.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">{"Location"}</label>
                      <p className="text-sm text-muted-foreground">{trainerData.personalInfo.location}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{"Professional Background"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">{"Experience"}</label>
                      <p className="text-sm text-muted-foreground">{trainerData.professionalBackground.experience}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">{"Current Role"}</label>
                      <p className="text-sm text-muted-foreground">{trainerData.professionalBackground.currentRole}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">{"Specializations"}</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {trainerData.professionalBackground.specializations.map((spec: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
