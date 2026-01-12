"use client"

import { useEffect, useState } from "react"
import { getContacts } from "@/lib/actions/contact"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Calendar, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadContacts() {
      const data = await getContacts()
      setContacts(data)
      setIsLoading(false)
    }
    loadContacts()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "replied":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Contact Form Submissions</h1>
        <p className="text-muted-foreground mt-1">Manage and respond to user inquiries</p>
      </div>

      {contacts.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No contact submissions yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-semibold text-foreground">
                    {contact.first_name} {contact.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </p>
                  <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                    {contact.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Phone
                  </p>
                  <p className="font-semibold text-foreground">{contact.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Date
                  </p>
                  <p className="text-sm text-foreground">
                    {formatDistanceToNow(new Date(contact.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Subject</p>
                <p className="font-semibold text-foreground">{contact.subject}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Message</p>
                <p className="text-foreground whitespace-pre-wrap">{contact.message}</p>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(contact.status)}>{contact.status.toUpperCase()}</Badge>
                <Button variant="outline" size="sm">
                  Reply
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
