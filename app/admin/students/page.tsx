"use client"

import { useEffect, useState } from "react"
import { ChartCard } from "@/components/dashboard/chart-card"
import { DataTable } from "@/components/dashboard/data-table"
import { getAllStudents } from "@/lib/actions/admin"
import { Button } from "@/components/ui/button"
import { Download, Eye, Mail, Phone, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStudents() {
      setIsLoading(true)
      try {
        const data = await getAllStudents()
        setStudents(data)
      } catch (error) {
        console.error("Error loading students:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadStudents()
  }, [])

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Plan", "Tests Attempted", "Last Active"]
    const rows = students.map((s) => [s.name, s.email, s.phone || "", s.plan, s.testsAttempted, s.lastActive])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "students.csv"
    a.click()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Students</h1>
          <p className="text-sm lg:text-base text-muted-foreground mt-1">Manage and monitor all enrolled students</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto" onClick={handleExportCSV}>
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <ChartCard title={`All Students (${students.length})`}>
        <div className="overflow-x-auto -mx-4 lg:mx-0">
          <div className="min-w-[800px] lg:min-w-0 px-4 lg:px-0">
            <DataTable
              data={students}
              searchKey="name"
              pageSize={10}
              columns={[
                { key: "name", header: "Name", sortable: true },
                { key: "email", header: "Email" },
                { key: "phone", header: "Phone" },
                {
                  key: "plan",
                  header: "Plan",
                  sortable: true,
                  render: (student: any) => (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.plan === "pro"
                          ? "bg-primary/20 text-primary"
                          : student.plan === "basic"
                            ? "bg-amber-500/20 text-amber-500"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {(student.plan || "free").toUpperCase()}
                    </span>
                  ),
                },
                { key: "testsAttempted", header: "Tests", sortable: true },
                { key: "lastActive", header: "Last Active" },
                {
                  key: "actions",
                  header: "Actions",
                  render: (student: any) => (
                    <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(student)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </ChartCard>

      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto mx-4 lg:mx-auto">
          {selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl lg:text-2xl">Student Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 lg:space-y-6 py-4">
                {/* Basic Info */}
                <div className="flex flex-col sm:flex-row items-start gap-4 lg:gap-6 p-4 bg-muted/30 rounded-xl">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl lg:text-2xl font-bold text-primary flex-shrink-0">
                    {selectedStudent.name?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg lg:text-xl font-bold text-foreground">{selectedStudent.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{selectedStudent.email}</span>
                      </span>
                      {selectedStudent.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          {selectedStudent.phone}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 lg:gap-3 mt-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedStudent.plan === "pro"
                            ? "bg-primary/20 text-primary"
                            : selectedStudent.plan === "basic"
                              ? "bg-amber-500/20 text-amber-500"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {(selectedStudent.plan || "free").toUpperCase()} Plan
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Enrolled: {new Date(selectedStudent.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                  <div className="p-3 lg:p-4 bg-muted/30 rounded-xl text-center">
                    <p className="text-xl lg:text-2xl font-bold text-foreground">
                      {selectedStudent.testsAttempted || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Tests Attempted</p>
                  </div>
                  <div className="p-3 lg:p-4 bg-muted/30 rounded-xl text-center">
                    <p className="text-xl lg:text-2xl font-bold text-primary">{selectedStudent.progress || 0}%</p>
                    <p className="text-xs text-muted-foreground">Progress</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
