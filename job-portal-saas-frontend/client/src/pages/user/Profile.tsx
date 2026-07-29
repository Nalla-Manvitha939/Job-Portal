import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Upload, Trash2, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";

export default function Profile() {
  const [, navigate] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    userId: 0,

    firstName: "",
    lastName: "",

    email: "",
    phone: "",
    location: "",

    headline: "",
    bio: "",

    skills: [] as string[],

    experience: [] as {
      id: number;
      title: string;
      company: string;
      duration: string;
      description: string;
    }[],

    education: [] as {
      id: number;
      school: string;
      degree: string;
      year: string;
    }[],
    resumeName: "",
    profileImage: "", 
  });

  
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );

    if (!currentUser) return;

    const profiles = JSON.parse(
      localStorage.getItem("profiles") || "[]"
    );

    const existingProfile = profiles.find(
      (profile: any) =>
        Number(profile.userId) === Number(currentUser.id)
    );

    
    if (existingProfile) {
      setProfileData(existingProfile);
      setProfileImage(existingProfile.profileImage || "");
    } else {
      setProfileData({
        userId: currentUser.id,

        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",

        email: currentUser.email || "",
        phone: currentUser.phone || "",
        location: "",

        headline: "",
        bio: "",

        skills: [],

        experience: [],

        education: [],
        resumeName: "",
        profileImage: "", 
      });
    }
  }, []);

  const [newSkill, setNewSkill] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);

  const [showEducationForm, setShowEducationForm] = useState(false);
  const [newEducation, setNewEducation] = useState({
    school: "",
    degree: "",
    year: "",
  });

  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    duration: "",
    description: "",
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const profiles = JSON.parse(
      localStorage.getItem("profiles") || "[]"
    );

    const index = profiles.findIndex(
      (p: any) =>
        Number(p.userId) === Number(profileData.userId)
    );

    
    const updatedProfile = {
      ...profileData,
      resumeName: resumeFile?.name || profileData.resumeName,
      profileImage,
    };

    if (index >= 0) {
      profiles[index] = updatedProfile;
    } else {
      profiles.push(updatedProfile);
    }

    localStorage.setItem(
      "profiles",
      JSON.stringify(profiles)
    );

    setIsEditing(false);

    alert("Profile saved successfully.");
  };

  return (
    <div className="min-h-screen bg-background">
      {}
      <div className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="container py-4">
          <button
            onClick={() => navigate("/user/dashboard")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Profile</h1>
              <p className="text-sm text-muted-foreground">Manage your profile and professional information</p>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "default" : "outline"}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </div>
      </div>

      
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <Card className="glass-card p-8">
            <div className="flex items-start gap-6 mb-6">
              
              
              <div className="flex flex-col items-center">
                <div className="relative">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center text-3xl font-bold text-accent">
                      {profileData.firstName?.charAt(0)}
                      {profileData.lastName?.charAt(0)}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="mt-3">
                    <input
                      type="file"
                      id="profile-image"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProfileImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <label
                        htmlFor="profile-image"
                        className="cursor-pointer"
                      >
                        Upload Photo
                      </label>
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="headline">Professional Headline</Label>
                      <Input
                        id="headline"
                        name="headline"
                        value={profileData.headline}
                        onChange={handleChange}
                        placeholder="e.g., Senior React Developer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold">{profileData.firstName} {profileData.lastName}</h2>
                    <p className="text-lg text-accent mb-2">{profileData.headline}</p>
                    <p className="text-muted-foreground">{profileData.bio}</p>
                  </div>
                )}
              </div>
            </div>

            
            {isEditing ? (
              <div className="grid md:grid-cols-2 gap-4 pt-6 border-t border-border">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={profileData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-border text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Email</p>
                  <p className="font-medium">{profileData.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Phone</p>
                  <p className="font-medium">{profileData.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Location</p>
                  <p className="font-medium">{profileData.location}</p>
                </div>
              </div>
            )}

            {isEditing && (
              <div className="flex gap-3 pt-6 border-t border-border">
                <Button className="flex-1 btn-premium" onClick={handleSave}>
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </Card>

          
          <Tabs defaultValue="skills" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
            </TabsList>

            
            <TabsContent value="skills">
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Skills</h3>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowSkillInput(!showSkillInput)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                  )}
                </div>
                {showSkillInput && (
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Enter skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                    />

                    <Button
                      onClick={() => {
                        if (!newSkill.trim()) return;

                        setProfileData((prev) => ({
                          ...prev,
                          skills: [...prev.skills, newSkill],
                        }));

                        setNewSkill("");
                        setShowSkillInput(false);
                      }}
                    >
                      Add
                    </Button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1 flex items-center gap-2"
                    >
                      {skill}

                      {isEditing && (
                        <Trash2
                          className="w-3 h-3 cursor-pointer"
                          onClick={() =>
                            setProfileData((prev) => ({
                              ...prev,
                              skills: prev.skills.filter((_, i) => i !== index),
                            }))
                          }
                        />
                      )}
                    </Badge>
                  ))}
                </div>
              </Card>
            </TabsContent>

            
            <TabsContent value="experience">
              <Card className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Experience</h3>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowExperienceForm(!showExperienceForm)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  )}
                </div>
                {showExperienceForm && (
                  <Card className="mb-4 p-4 border border-border bg-background/50">
                    <div className="space-y-3">
                      <Input
                        placeholder="Job Title"
                        value={newExperience.title}
                        onChange={(e) =>
                          setNewExperience({
                            ...newExperience,
                            title: e.target.value,
                          })
                        }
                      />

                      <Input
                        placeholder="Company"
                        value={newExperience.company}
                        onChange={(e) =>
                          setNewExperience({
                            ...newExperience,
                            company: e.target.value,
                          })
                        }
                      />

                      <Input
                        placeholder="Duration"
                        value={newExperience.duration}
                        onChange={(e) =>
                          setNewExperience({
                            ...newExperience,
                            duration: e.target.value,
                          })
                        }
                      />

                      <Textarea
                        placeholder="Description"
                        value={newExperience.description}
                        onChange={(e) =>
                          setNewExperience({
                            ...newExperience,
                            description: e.target.value,
                          })
                        }
                      />

                      <Button
                        onClick={() => {
                          if (
                            !newExperience.title ||
                            !newExperience.company
                          )
                            return;

                          setProfileData((prev) => ({
                            ...prev,
                            experience: [
                              ...prev.experience,
                              {
                                id: Date.now(),
                                ...newExperience,
                              },
                            ],
                          }));

                          setNewExperience({
                            title: "",
                            company: "",
                            duration: "",
                            description: "",
                          });

                          setShowExperienceForm(false);
                        }}
                      >
                        Save Experience
                      </Button>
                    </div>
                  </Card>
                )}
                {profileData.experience.map((exp) => (
                  <div key={exp.id} className="p-4 rounded-lg bg-background/50 border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold">{exp.title}</p>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                      </div>
                      {isEditing && <Trash2 className="w-4 h-4 text-muted-foreground cursor-pointer" />}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{exp.duration}</p>
                    <p className="text-sm text-muted-foreground">{exp.description}</p>
                  </div>
                ))}
              </Card>
            </TabsContent>

            
            <TabsContent value="education">
              <Card className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Education</h3>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowEducationForm(!showEducationForm)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  )}
                </div>

                {showEducationForm && (
                  <Card className="mb-4 p-4 border border-border bg-background/50">
                    <div className="space-y-3">
                      <Input
                        placeholder="School / College"
                        value={newEducation.school}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            school: e.target.value,
                          })
                        }
                      />

                      <Input
                        placeholder="Degree"
                        value={newEducation.degree}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            degree: e.target.value,
                          })
                        }
                      />

                      <Input
                        placeholder="Year"
                        value={newEducation.year}
                        onChange={(e) =>
                          setNewEducation({
                            ...newEducation,
                            year: e.target.value,
                          })
                        }
                      />

                      <Button
                        onClick={() => {
                          if (!newEducation.school || !newEducation.degree)
                            return;

                          setProfileData((prev) => ({
                            ...prev,
                            education: [
                              ...prev.education,
                              {
                                id: Date.now(),
                                ...newEducation,
                              },
                            ],
                          }));

                          setNewEducation({
                            school: "",
                            degree: "",
                            year: "",
                          });

                          setShowEducationForm(false);
                        }}
                      >
                        Save Education
                      </Button>
                    </div>
                  </Card>
                )}

                {profileData.education.map((edu) => (
                  <div key={edu.id} className="p-4 rounded-lg bg-background/50 border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold">{edu.degree}</p>
                        <p className="text-sm text-muted-foreground">{edu.school}</p>
                      </div>
                      {isEditing && (
                        <Trash2
                          className="w-4 h-4 text-muted-foreground cursor-pointer"
                          onClick={() =>
                            setProfileData((prev) => ({
                              ...prev,
                              education: prev.education.filter(
                                (item) => item.id !== edu.id
                              ),
                            }))
                          }
                        />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{edu.year}</p>
                  </div>
                ))}
              </Card>
            </TabsContent>
          </Tabs>

          
          <Card className="glass-card p-6">
            <h3 className="text-lg font-bold mb-4">Resume</h3>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-4" />

              <p className="font-medium mb-2">
                {profileData.resumeName || "Upload your resume"}
              </p>

              <p className="text-sm text-muted-foreground mb-4">
                PDF, DOC or DOCX (Max 5MB)
              </p>

              {isEditing && (
                <>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (file.size > 5 * 1024 * 1024) {
                        alert("Maximum file size is 5MB");
                        return;
                      }

                      setResumeFile(file);

                      setProfileData((prev) => ({
                        ...prev,
                        resumeName: file.name,
                      }));
                    }}
                  />

                  <Button asChild>
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      Choose Resume
                    </label>
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}