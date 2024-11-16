'use client'

import React, { useState, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { jsPDF } from "jspdf"
import { PlusCircle, MinusCircle, ArrowUp, ArrowDown, Edit2 } from 'lucide-react'

type SectionContent = {
  [key: string]: string[]
}

type Section = {
  id: string
  title: string
  content: SectionContent
}

type ResumeData = {
  name: string
  email: string
  phone: string
  location: string
  sections: Section[]
}

type ThemeType = 'modern' | 'traditional' | 'minimal'
type FontType = 'inter' | 'times' | 'helvetica' | 'georgia'

interface ThemeConfig {
  fontFamily: string
  fontSize: {
    name: string
    section: string
    content: string
    small: string
  }
  spacing: {
    section: string
    item: string
  }
  colors: {
    primary: string
    secondary: string
    text: string
  }
}

const themes: Record<ThemeType, ThemeConfig> = {
  modern: {
    fontFamily: 'inter',
    fontSize: {
      name: 'text-2xl',
      section: 'text-lg',
      content: 'text-sm',
      small: 'text-xs'
    },
    spacing: {
      section: 'mb-4',
      item: 'mb-2'
    },
    colors: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      text: 'text-gray-700'
    }
  },
  traditional: {
    fontFamily: 'times',
    fontSize: {
      name: 'text-2xl',
      section: 'text-base',
      content: 'text-sm',
      small: 'text-xs'
    },
    spacing: {
      section: 'mb-3',
      item: 'mb-1'
    },
    colors: {
      primary: 'text-black',
      secondary: 'text-gray-800',
      text: 'text-gray-900'
    }
  },
  minimal: {
    fontFamily: 'helvetica',
    fontSize: {
      name: 'text-xl',
      section: 'text-base',
      content: 'text-sm',
      small: 'text-xs'
    },
    spacing: {
      section: 'mb-3',
      item: 'mb-1'
    },
    colors: {
      primary: 'text-gray-800',
      secondary: 'text-gray-600',
      text: 'text-gray-700'
    }
  }
}

const fonts = {
  inter: {
    name: 'Inter',
    className: 'font-sans'
  },
  times: {
    name: 'Times New Roman',
    className: 'font-serif'
  },
  helvetica: {
    name: 'Helvetica',
    className: 'font-sans'
  },
  georgia: {
    name: 'Georgia',
    className: 'font-serif'
  }
}

const initialResumeData: ResumeData = {
  name: "John Doe",
  email: "john.doe@resumeworld.com",
  phone: "+1 (123) 456-7890",
  location: "San Francisco, CA",
  sections: [
    {
      id: '1',
      title: 'Education',
      content: {
        "Tech University | Master of Science in Computer Science": [
          "May 2015",
          "Austin, TX",
          "Graduated with High Distinction (Top 10%)",
          "President of the Tech Innovation Club (300+ members), Hackathon Organizer",
          "Capstone Project: Developed a machine learning model to predict network security threats with 85% accuracy"
        ],
        "Tech University | Bachelor of Science in Software Engineering": [
          "May 2013",
          "San Francisco, CA",
          "Cumulative GPA: 3.9/4.0; Dean's List 2011, 2012, 2013",
          "Vice President of the Coding Club, Member of Robotics Club"
        ]
      }
    },
    {
      id: '2',
      title: 'Professional Experience',
      content: {
        "Innovatech Solutions | Senior Software Engineer": [
          "Oct 2017 – Present",
          "San Francisco, CA",
          "Led a team of 8 engineers across 3 locations, collaborating on developing scalable web applications and APIs for high-traffic environments",
          "Implemented automated testing and CI/CD pipelines, reducing deployment time by 40% and improving code reliability",
          "Designed a data processing system that reduced report generation time by 60%, enhancing data accessibility for decision-making"
        ],
        "Webwise Inc. | Software Engineer": [
          "Jun 2015 – Oct 2017",
          "San Francisco, CA",
          "Built and maintained RESTful APIs, optimizing performance to handle over 100,000 requests per minute",
          "Streamlined data retrieval processes, decreasing load times by 20% across the platform, and improving user experience",
          "Collaborated with UX/UI teams to enhance website accessibility, achieving a 25% increase in engagement metrics"
        ],
        "NextGen Tech | Junior Developer": [
          "Jun 2013 – May 2015",
          "Austin, TX",
          "Developed front-end components using React, improving application responsiveness and user satisfaction",
          "Automated routine processes, reducing manual effort by 30% and increasing productivity across the team",
          "Contributed to database optimization, achieving a 15% improvement in query performance and data integrity"
        ]
      }
    },
    {
      id: '3',
      title: 'Other',
      content: {
        "Technical Skills": [
          "JavaScript, TypeScript, Python, Java, SQL, MongoDB, AWS, Docker, Jenkins, React, Node.js, Express"
        ],
        "Languages": [
          "English (Native), Spanish (Fluent)"
        ],
        "Certifications": [
          "AWS Certified Solutions Architect (2019), Certified ScrumMaster (CSM), Machine Learning Specialization"
        ]
      }
    }
  ]
};



export default function ResumePage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData)
  const [theme, setTheme] = useState<ThemeType>('traditional')
  const [font, setFont] = useState<FontType>('times')
  const [editingTitle, setEditingTitle] = useState<string | null>(null)
  const [newKeyValue, setNewKeyValue] = useState<{ [key: string]: string }>({})
  const pdfRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (field: keyof ResumeData, value: string) => {
    setResumeData(prev => ({ ...prev, [field]: value }))
  }

  const handleSectionTitleChange = (sectionId: string, newTitle: string) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, title: newTitle } : section
      )
    }))
    setEditingTitle(null)
  }

  const addSection = () => {
    const newId = String(Date.now())
    setResumeData(prev => ({
      ...prev,
      sections: [...prev.sections, { id: newId, title: 'New Section', content: {} }]
    }))
  }

  const removeSection = (sectionId: string) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }))
  }

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const sectionIndex = resumeData.sections.findIndex(section => section.id === sectionId)
    if (
      (direction === 'up' && sectionIndex === 0) ||
      (direction === 'down' && sectionIndex === resumeData.sections.length - 1)
    ) {
      return
    }

    const newIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1
    const newSections = [...resumeData.sections]
    const [removed] = newSections.splice(sectionIndex, 1)
    newSections.splice(newIndex, 0, removed)

    setResumeData(prev => ({ ...prev, sections: newSections }))
  }

  const addKey = (sectionId: string) => {
    const key = newKeyValue[sectionId] || ''
    if (!key) return

    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, content: { ...section.content, [key]: [''] } }
          : section
      )
    }))
    setNewKeyValue(prev => ({ ...prev, [sectionId]: '' }))
  }

  const removeKey = (sectionId: string, key: string) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, content: Object.fromEntries(Object.entries(section.content).filter(([k]) => k !== key)) }
          : section
      )
    }))
  }

  const addBulletPoint = (sectionId: string, key: string) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? { ...section, content: { ...section.content, [key]: [...section.content[key], ''] } }
          : section
      )
    }))
  }

  const removeBulletPoint = (sectionId: string, key: string, index: number) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              content: {
                ...section.content,
                [key]: section.content[key].filter((_, i) => i !== index)
              }
            }
          : section
      )
    }))
  }

  const handleBulletPointChange = (sectionId: string, key: string, index: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              content: {
                ...section.content,
                [key]: section.content[key].map((item, i) => i === index ? value : item)
              }
            }
          : section
      )
    }))
  }

  const generatePDF = () => {
    if (!pdfRef.current) return

    const pdf = new jsPDF({
      unit: 'pt',
      format: 'a4'
    })

    const fontFamily = themes[theme].fontFamily === 'times' ? 'times' : 'helvetica'
    pdf.setFont(fontFamily)

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const margin = 40
    let yOffset = margin

    const addWrappedText = (
      text: string,
      fontSize: number,
      fontStyle: string = 'normal',
      maxWidth: number = pdfWidth - 2 * margin,
      align: 'left' | 'right' = 'left'
    ) => {
      pdf.setFontSize(fontSize)
      pdf.setFont(fontFamily, fontStyle)
      const lines = pdf.splitTextToSize(text, maxWidth)
      
      if (yOffset > pdfHeight - margin) {
        pdf.addPage()
        yOffset = margin
      }

      if (align === 'right') {
        const lineWidth = pdf.getTextWidth(lines[0])
        pdf.text(lines[0], pdfWidth - margin - lineWidth, yOffset)
      } else {
        pdf.text(lines[0], margin, yOffset)
      }
      yOffset += fontSize * 1.15

      // If there are additional lines, add them below
      if (lines.length > 1) {
        for (let i = 1; i < lines.length; i++) {
          if (yOffset > pdfHeight - margin) {
            pdf.addPage()
            yOffset = margin
          }
          pdf.text(lines[i], margin, yOffset)
          yOffset += fontSize * 1.15
        }
      }
    }

    // Add name and contact info
    addWrappedText(resumeData.name, 14, 'bold')
    yOffset += 5

    const contactInfo = `${resumeData.email} | ${resumeData.phone} | ${resumeData.location}`
    addWrappedText(contactInfo, 10)
    yOffset += 15

    // Add sections
    resumeData.sections.forEach((section) => {
      addWrappedText(section.title.toUpperCase(), 12, 'bold')
      yOffset += 10

      Object.entries(section.content).forEach(([key, bullets]) => {
        if (key) {
          const parts = key.split(' | ')
          const title = parts[0]
          const details = parts[1]

          // Calculate the width available for the title
          const maxTitleWidth = (pdfWidth - 2 * margin) * 0.6 // 60% of the width for title
          const maxDetailsWidth = (pdfWidth - 2 * margin) * 0.4 // 40% for details/date

          pdf.setFontSize(11)
          pdf.setFont(fontFamily, 'bold')

          // Add title and details on the same line
          const wrappedTitle = pdf.splitTextToSize(title, maxTitleWidth)
          pdf.text(wrappedTitle[0], margin, yOffset)

          if (details) {
            const detailsWidth = pdf.getTextWidth(details)
            
            pdf.text(details, pdfWidth - margin - detailsWidth, yOffset)
          }

          yOffset += 15

          // If title had multiple lines, add them
          if (wrappedTitle.length > 1) {
            for (let i = 1; i < wrappedTitle.length; i++) {
              pdf.text(wrappedTitle[i], margin, yOffset)
              yOffset += 12
            }
          }
        }

        bullets.forEach((bullet) => {
          if (yOffset > pdfHeight - margin) {
            pdf.addPage()
            yOffset = margin
          }

          pdf.setFont(fontFamily, 'normal')
          pdf.setFontSize(10)
          const bulletText = key ? `• ${bullet}` : bullet
          const lines = pdf.splitTextToSize(bulletText, pdfWidth - (key ? margin * 3 : margin * 2))
          
          lines.forEach((line: string) => {
            pdf.text(line, key ? margin + 15 : margin, yOffset)
            yOffset += 12
          })
        })
        yOffset += 5
      })

      yOffset += 15
    })

    pdf.save('resume.pdf')
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="w-full lg:w-1/2 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Resume Builder</h1>
        <div className="mb-6 space-y-4">
          <div className="flex space-x-4">
            <div className="w-1/2">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={(value: ThemeType) => setTheme(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <Label>Font</Label>
              <Select value={font} onValueChange={(value: FontType) => setFont(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="times">Times New Roman</SelectItem>
                  <SelectItem value="helvetica">Helvetica</SelectItem>
                  <SelectItem value="georgia">Georgia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <form className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={resumeData.name} 
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={resumeData.email} 
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input 
              id="phone" 
              value={resumeData.phone} 
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              value={resumeData.location} 
              onChange={(e) => handleInputChange('location', e.target.value)}
            />
          </div>
          
          {resumeData.sections.map((section) => (
            <div key={section.id} className="border p-4 rounded-md mb-4">
              <div className="flex items-center justify-between mb-2">
                {editingTitle === section.id ? (
                  <Input
                    value={section.title}
                    onChange={(e) => handleSectionTitleChange(section.id, e.target.value)}
                    onBlur={() => setEditingTitle(null)}
                    autoFocus
                  />
                ) : (
                  <h2 className="text-xl font-bold">{section.title}</h2>
                )}
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => setEditingTitle(section.id)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => moveSection(section.id, 'up')}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => moveSection(section.id, 'down')}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => removeSection(section.id)}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {Object.entries(section.content).map(([key, bullets]) => (
                <div key={key} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Input
                      value={key}
                      onChange={(e) => {
                        const newContent = { ...section.content }
                        newContent[e.target.value] = newContent[key]
                        delete newContent[key]
                        setResumeData(prev => ({
                          ...prev,
                          sections: prev.sections.map(s =>
                            s.id === section.id ? { ...s, content: newContent } : s
                          )
                        }))
                      }}
                      className="font-semibold"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeKey(section.id, key)}
                    >
                      Remove
                    </Button>
                  </div>
                  {bullets.map((bullet, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <Input
                        value={bullet}
                        onChange={(e) => handleBulletPointChange(section.id, key, index, e.target.value)}
                        className="flex-grow mr-2"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => removeBulletPoint(section.id, key, index)}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addBulletPoint(section.id, key)}
                  >
                    Add Bullet Point
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center mt-4">
                <Input
                  placeholder="New key"
                  value={newKeyValue[section.id] || ''}
                  onChange={(e) => setNewKeyValue({ ...newKeyValue, [section.id]: e.target.value })}
                  className="flex-grow mr-2"
                />
                <Button type="button" onClick={() => addKey(section.id)}>
                  Add Key
                </Button>
              </div>
            </div>
          ))}
          
          <Button type="button" onClick={addSection}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Section
          </Button>
        </form>
      </div>
      <div className="w-full lg:w-1/2 p-4 bg-gray-100 overflow-y-auto">
        <div 
          ref={pdfRef} 
          className={`bg-white p-6 shadow-lg ${fonts[font].className}`}
          style={{ fontFamily: fonts[font].name }}
        >
          <div className="text-center mb-4">
            <h1 className={`${themes[theme].fontSize.name} font-bold ${themes[theme].colors.primary}`}>
              {resumeData.name}
            </h1>
            <p className={`${themes[theme].fontSize.small} ${themes[theme].colors.secondary}`}>
              {resumeData.email} | {resumeData.phone} | {resumeData.location}
            </p>
          </div>
          
          {resumeData.sections.map((section, index) => (
            <div key={section.id} className={themes[theme].spacing.section}>
              <h2 className={`${themes[theme].fontSize.section} font-bold uppercase ${themes[theme].colors.primary} mb-2`}>
                {section.title}
              </h2>
              
              {Object.entries(section.content).map(([key, bullets]) => (
                <div key={key} className={themes[theme].spacing.item}>
                  {key && (
                    <div className="flex justify-between items-baseline">
                      <div className="flex-1 pr-4">
                        <h3 className={`${themes[theme].fontSize.content} font-semibold`}>
                          {key.split(' | ')[0]}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className={`${themes[theme].fontSize.small} ${themes[theme].colors.secondary}`}>
                          {key.split(' | ')[1]}
                        </span>
                      </div>
                    </div>
                  )}
                  <ul className={key ? "list-disc ml-4 mt-1" : ""}>
                    {bullets.map((bullet, index) => (
                      <li 
                        key={index} 
                        className={`${themes[theme].fontSize.small} ${themes[theme].colors.text} mb-1`}
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
        <Button onClick={generatePDF} className="mt-4">Download PDF</Button>
      </div>
    </div>
  )
}