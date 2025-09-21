"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, TrendingUp, BarChart3, Download, Filter, Calendar, MapPin, LogOut } from "lucide-react"

export default function PolicyMakerDashboard() {
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months")

  const handleLogout = () => {
    window.location.href = "/login"
  }

  // Mock data for demonstration
  const overviewStats = {
    totalLearners: 12450,
    activeTrainers: 890,
    coursesOffered: 139,
    completionRate: 73,
    employmentRate: 68,
    avgSkillGain: 85,
  }

  const regionalData = [
    { state: "Maharashtra", learners: 2340, completion: 78, employment: 72 },
    { state: "Karnataka", learners: 1890, completion: 75, employment: 69 },
    { state: "Tamil Nadu", learners: 1650, completion: 71, employment: 65 },
    { state: "Gujarat", learners: 1420, completion: 76, employment: 70 },
    { state: "Uttar Pradesh", learners: 1180, completion: 68, employment: 62 },
  ]

  const trendingCourses = [
    { name: "Cybersecurity Fundamentals", enrollments: 1240, growth: 23 },
    { name: "Full Stack Web Development", enrollments: 980, growth: 18 },
    { name: "Data Science & Analytics", enrollments: 760, growth: 31 },
    { name: "Digital Marketing", enrollments: 650, growth: 15 },
    { name: "IoT Systems Development", enrollments: 540, growth: 28 },
  ]

  const skillGapAnalysis = [
    { skill: "Artificial Intelligence", demand: 92, supply: 34, gap: 58 },
    { skill: "Cybersecurity", demand: 88, supply: 52, gap: 36 },
    { skill: "Cloud Computing", demand: 85, supply: 48, gap: 37 },
    { skill: "Data Analytics", demand: 82, supply: 61, gap: 21 },
    { skill: "Mobile Development", demand: 78, supply: 65, gap: 13 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{"VidyaVaradhi"}</h1>
                <p className="text-sm text-muted-foreground">{"Policy Maker Dashboard"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{"Dr. Rajesh Gupta"}</p>
                <p className="text-sm text-muted-foreground">{"Ministry of Education"}</p>
              </div>
              <Avatar>
                <AvatarFallback>
                  <AvatarInitials name="Dr. Rajesh Gupta" />
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
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                {"Analytics Filters"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{"All Regions"}</SelectItem>
                      <SelectItem value="north">{"North India"}</SelectItem>
                      <SelectItem value="south">{"South India"}</SelectItem>
                      <SelectItem value="west">{"West India"}</SelectItem>
                      <SelectItem value="east">{"East India"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1month">{"Last Month"}</SelectItem>
                      <SelectItem value="3months">{"Last 3 Months"}</SelectItem>
                      <SelectItem value="6months">{"Last 6 Months"}</SelectItem>
                      <SelectItem value="1year">{"Last Year"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  {"Export Report"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Overview Stats */}
          <div className="grid md:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{"Total Learners"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{overviewStats.totalLearners.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {"12% from last month"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{"Active Trainers"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{overviewStats.activeTrainers}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {"8% from last month"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{"NSQF Courses"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{overviewStats.coursesOffered}</div>
                <div className="text-xs text-muted-foreground">{"66 Electronics + 73 IT"}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{"Completion Rate"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{overviewStats.completionRate}%</div>
                <Progress value={overviewStats.completionRate} className="h-1 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{"Employment Rate"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{overviewStats.employmentRate}%</div>
                <Progress value={overviewStats.employmentRate} className="h-1 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{"Avg Skill Gain"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{overviewStats.avgSkillGain}%</div>
                <Progress value={overviewStats.avgSkillGain} className="h-1 mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="regional" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="regional">{"Regional Analysis"}</TabsTrigger>
              <TabsTrigger value="trends">{"Course Trends"}</TabsTrigger>
              <TabsTrigger value="skills">{"Skill Gap Analysis"}</TabsTrigger>
              <TabsTrigger value="impact">{"Policy Impact"}</TabsTrigger>
            </TabsList>

            <TabsContent value="regional" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{"State-wise Performance Analysis"}</CardTitle>
                  <CardDescription>
                    {"Educational outcomes and learner engagement across different states"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {regionalData.map((state, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4 p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{state.state}</h3>
                          <p className="text-sm text-muted-foreground">{state.learners.toLocaleString()} learners</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{"Completion Rate"}</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={state.completion} className="h-2 flex-1" />
                            <span className="text-sm font-medium">{state.completion}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{"Employment Rate"}</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={state.employment} className="h-2 flex-1" />
                            <span className="text-sm font-medium">{state.employment}%</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            {"View Details"}
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{"Popular Course Trends"}</CardTitle>
                  <CardDescription>{"Most enrolled courses and their growth patterns"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trendingCourses.map((course, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium">{course.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {course.enrollments.toLocaleString()} enrollments
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="flex items-center text-sm">
                              <TrendingUp className="h-4 w-4 mr-1 text-primary" />
                              <span className="font-medium text-primary">+{course.growth}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{"growth"}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            {"Analyze"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{"Industry Skill Gap Analysis"}</CardTitle>
                  <CardDescription>
                    {"Comparison between market demand and current skill supply in the workforce"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {skillGapAnalysis.map((skill, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{skill.skill}</h3>
                          <Badge variant={skill.gap > 40 ? "destructive" : skill.gap > 20 ? "secondary" : "default"}>
                            {skill.gap}% gap
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">{"Market Demand"}</p>
                            <div className="flex items-center space-x-2">
                              <Progress value={skill.demand} className="h-2 flex-1" />
                              <span className="text-sm font-medium">{skill.demand}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">{"Current Supply"}</p>
                            <div className="flex items-center space-x-2">
                              <Progress value={skill.supply} className="h-2 flex-1" />
                              <span className="text-sm font-medium">{skill.supply}%</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Button variant="outline" size="sm" className="w-full bg-transparent">
                              {"Action Plan"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="impact" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{"Policy Implementation Impact"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">{"Digital India Initiative"}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {"Increased digital literacy course enrollments by 45% in rural areas"}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="default">{"Active"}</Badge>
                          <Button variant="outline" size="sm">
                            {"View Report"}
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">{"Skill India Mission"}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {"Enhanced employment rate by 23% among NSQF certified learners"}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="default">{"Active"}</Badge>
                          <Button variant="outline" size="sm">
                            {"View Report"}
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">{"Women Empowerment Program"}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {"Achieved 38% female participation in technical courses"}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{"Under Review"}</Badge>
                          <Button variant="outline" size="sm">
                            {"View Report"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{"Recommendations"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg border-l-4 border-l-primary">
                        <h3 className="font-medium mb-2">{"Increase AI/ML Course Offerings"}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {"High demand-supply gap identified in AI/ML skills"}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {"High Priority"}
                        </Badge>
                      </div>
                      <div className="p-4 border rounded-lg border-l-4 border-l-secondary">
                        <h3 className="font-medium mb-2">{"Regional Training Centers"}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {"Establish more centers in underperforming states"}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {"Medium Priority"}
                        </Badge>
                      </div>
                      <div className="p-4 border rounded-lg border-l-4 border-l-accent">
                        <h3 className="font-medium mb-2">{"Industry Partnerships"}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {"Strengthen ties with tech companies for better placement"}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {"Long-term"}
                        </Badge>
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
