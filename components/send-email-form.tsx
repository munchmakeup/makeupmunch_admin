"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useGetData } from "@/services/queryHooks/useGetData"

const formSchema = z.object({
  subject: z.string().min(2, { message: "Subject must be at least 2 characters." }),
  template: z.string().min(1, { message: "Please select an email template." }),
  content: z.string().min(10, { message: "Email content must be at least 10 characters." }),
  recipientType: z.string().min(1, { message: "Please select recipient type." }),
  recipients: z.array(z.string()).optional(),
  scheduledDate: z.date().optional(),
})




// const users = [
//   {
//     id: "user1",
//     name: "Sophia Anderson",
//     email: "sophia@example.com",
//     avatar: "/placeholder.svg?height=32&width=32",
//     type: "Customer",
//   },
//   {
//     id: "user2",
//     name: "Emma Johnson",
//     email: "emma@example.com",
//     avatar: "/placeholder.svg?height=32&width=32",
//     type: "Customer",
//   },
//   {
//     id: "user3",
//     name: "Priya Sharma",
//     email: "priya@example.com",
//     avatar: "/placeholder.svg?height=32&width=32",
//     type: "Artist",
//   },
//   {
//     id: "user4",
//     name: "Neha Patel",
//     email: "neha@example.com",
//     avatar: "/placeholder.svg?height=32&width=32",
//     type: "Artist",
//   },
//   {
//     id: "user5",
//     name: "Olivia Williams",
//     email: "olivia@example.com",
//     avatar: "/placeholder.svg?height=32&width=32",
//     type: "Customer",
//   },
// ]

export function SendEmailForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState("");
  const [joinDate, setJoinDate] = useState<Date | null>(null);
  const router = useRouter()
  const { toast } = useToast()


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      template: "",
      content: "",
      recipientType: "all",
      recipients: [],
    },
  })


  const handleViewProfile = (id: number) => {
    router.push(`/artists/${id}`)
  }



  const { data, isLoading, isError, error } = useGetData("getTemplates", "/admin/getTemplates")

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
    error: usersErr,
  } = useGetData("getAllUsers", "/admin/getBasicUsersForAdmin");

  // 3) Artists
  const {
    data: artistsData,
    isLoading: artistsLoading,
    isError: artistsError,
    error: artistsErr,
  } = useGetData("getAllArtists", "/admin/getBasicArtistsForAdmin");

  const emailTemplates = data?.data?.templateObject ? Object.values(data.data.templateObject) : [];

  const recipientType = form.watch("recipientType")
  const selectedRecipients = form.watch("recipients") || []
  const selectedTemplate = form.watch("template")



  const apiUsers =
    usersData?.data?.map((user) => ({
      id: user._id,
      name: user.username,
      email: user.email,
      avatar: user.profile_img || "",
      type: "Customer",
      city: user.city || "",
      joinedDate: user.joinedDate || "",
    })) || [];



  const apiArtists =
    artistsData?.data?.map((artist) => ({
      id: artist._id,
      name: artist.username,
      email: artist.email,
      avatar: artist.profile_img || "",
      type: "Artist",
      city: artist.city || "",
      joinedDate: artist.joinedDate || "",
    })) || [];




  const filteredList =
    recipientType === "selected_users"
      ? apiUsers
      : recipientType === "selected_artist"
        ? apiArtists
        : [];



  const filteredUsers = filteredList.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());


    const matchesCity =
      cityFilter === "" ||
      user.city?.toLowerCase().includes(cityFilter.toLowerCase());

    const matchesJoinDate =
      !joinDate ||
      format(new Date(user.joinedDate), "yyyy-MM-dd") ===
      format(joinDate, "yyyy-MM-dd");



    return matchesSearch && matchesCity && matchesJoinDate;

  })

  const handleTemplateChange = (templateId: string) => {
    const template = emailTemplates.find((t) => t.id === templateId)

    // if (template && template.id !== "custom") {
    //   form.setValue("subject", template.subject)
    //   form.setValue("content", template.content)
    // }

    if (template && template.id !== "custom") {
      form.setValue("subject", template.subject || "")
      form.setValue("content", template.html || "")
    } else {
      // Reset when custom template selected
      form.setValue("subject", "")
      form.setValue("content", "")
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Email sent successfully",
        description: values.scheduledDate
          ? `Your email has been scheduled for ${format(values.scheduledDate, "PPP")}.`
          : "Your email has been sent to the selected recipients.",
      })
      router.push("/notifications")
    }, 1500)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Template</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  handleTemplateChange(value)
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select email template" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {emailTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select a pre-defined template or create a custom email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-1">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email subject" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Content</FormLabel>
              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="edit">
                  <FormControl>
                    <Textarea placeholder="Enter email content" className="min-h-[300px] font-mono" {...field} />
                  </FormControl>
                </TabsContent>
                <TabsContent value="preview">
                  {/* <div className="border rounded-md p-4 min-h-[300px] whitespace-pre-line">
                    {field.value || "Email preview will appear here..."}
                  </div> */}


                  {/* <div
    className="border rounded-md p-4 min-h-[300px]"
    dangerouslySetInnerHTML={{
      __html: field.value || "Email preview will appear here...",
    }}
  /> */}

                  <iframe
                    className="w-full min-h-[300px] border rounded-md"
                    srcDoc={field.value}
                  />
                </TabsContent>
              </Tabs>
              <FormDescription>
                Use &#123;&#123;name&#125;&#125; to insert the recipient's name and other variables like
                &#123;&#123;date&#125;&#125;, &#123;&#123;time&#125;&#125;, etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduledDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Schedule (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : "Schedule for later"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Leave empty to send immediately, or select a date to schedule for later.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="recipientType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Recipients</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="all" />
                      </FormControl>
                      <FormLabel className="font-normal">All Users</FormLabel>
                    </FormItem>
                    {/* <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="customers" />
                      </FormControl>
                      <FormLabel className="font-normal">All Customers</FormLabel>
                    </FormItem> */}
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="artists" />
                      </FormControl>
                      <FormLabel className="font-normal">All Artists</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="featured_artists" />
                      </FormControl>
                      <FormLabel className="font-normal">Featured Artists</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="selected_users" />
                      </FormControl>
                      <FormLabel className="font-normal">Selected Users</FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="selected_artist" />
                      </FormControl>
                      <FormLabel className="font-normal">Selected Artists</FormLabel>
                    </FormItem>

                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(recipientType === "selected_users" || recipientType === "selected_artist") && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* CITY FILTER */}
                <div>
                  <Input
                    placeholder="Filter by city..."
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                  />
                </div>

                {/* JOIN DATE FILTER */}
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {joinDate
                          ? format(joinDate, "PPP")
                          : "Filter by Join Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={joinDate}
                        onSelect={setJoinDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <FormDescription>
                Showing {filteredUsers.length} of {recipientType === "selected_users" ? apiUsers.length : apiArtists.length}
                {recipientType === "selected_users" ? "Users" : "Artists"} — Select the recipients below.
              </FormDescription>

              <div className="border rounded-md p-4 space-y-4">
                <FormField
                  control={form.control}
                  name="recipients"
                  render={() => (
                    <FormItem>
                      <div className="grid gap-2">
                        {filteredUsers.map((user) => (
                          <FormField
                            key={user.id}
                            control={form.control}
                            name="recipients"
                            render={({ field }) => {
                              return (
                                <FormItem key={user.id} className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(user.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), user.id])
                                          : field.onChange(field.value?.filter((value) => value !== user.id))
                                      }}
                                    />
                                  </FormControl>
                                  <div className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded-md"
                                    onClick={() => router.push(`/artists/${user.id}`)}

                                  >
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={user.avatar || ""} alt={user.name} />
                                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">{user.name}</span>
                                      <span className="text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                    <Badge variant="outline" className="ml-2">
                                      {user.city}
                                    </Badge>
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {selectedRecipients.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {selectedRecipients.length} recipient{selectedRecipients.length !== 1 ? "s" : ""} selected
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/notifications")}>
            Cancel
          </Button>
          <Button type="submit" className="bg-pink-600 hover:bg-pink-700" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : form.getValues("scheduledDate") ? "Schedule" : "Send Now"}
          </Button>
        </div>
      </form>
    </Form>
  )
}








// const emailTemplates = [
//   {
//     id: "welcome",
//     name: "Welcome Email",
//     subject: "Welcome to MakeupMunch!",
//     content:
//       "Dear {{name}},\n\nWelcome to MakeupMunch! We're excited to have you join our platform.\n\nWith MakeupMunch, you can easily book professional makeup artists for any occasion. Whether it's for your wedding, engagement, or a party, we've got you covered.\n\nExplore our app to discover talented makeup artists in your area.\n\nBest regards,\nThe MakeupMunch Team",
//   },
//   {
//     id: "booking_confirmation",
//     name: "Booking Confirmation",
//     subject: "Your Booking is Confirmed",
//     content:
//       "Dear {{name}},\n\nYour booking with {{artist_name}} for {{service}} on {{date}} at {{time}} has been confirmed.\n\nBooking Details:\n- Service: {{service}}\n- Date: {{date}}\n- Time: {{time}}\n- Location: {{location}}\n- Amount: {{amount}}\n\nIf you need to make any changes to your booking, please contact us at least 24 hours before your appointment.\n\nBest regards,\nThe MakeupMunch Team",
//   },
//   {
//     id: "payment_receipt",
//     name: "Payment Receipt",
//     subject: "Payment Receipt for Your Booking",
//     content:
//       "Dear {{name}},\n\nThank you for your payment of {{amount}} for your booking with {{artist_name}}.\n\nPayment Details:\n- Transaction ID: {{transaction_id}}\n- Payment Method: {{payment_method}}\n- Amount: {{amount}}\n- Date: {{date}}\n\nYour booking is now confirmed. We look forward to serving you.\n\nBest regards,\nThe MakeupMunch Team",
//   },
//   {
//     id: "promotional",
//     name: "Promotional Offer",
//     subject: "Special Offer Just for You!",
//     content:
//       "Dear {{name}},\n\nWe're excited to offer you a special discount on your next booking!\n\nUse code SPECIAL20 to get 20% off on any makeup service booked through our platform.\n\nThis offer is valid until {{expiry_date}}. Don't miss out on this limited-time offer!\n\nBest regards,\nThe MakeupMunch Team",
//   },
//   {
//     id: "custom",
//     name: "Custom Email",
//     subject: "",
//     content: "",
//   },
// ]