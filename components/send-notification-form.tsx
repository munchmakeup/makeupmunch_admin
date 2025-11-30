"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { date, z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Edit, MoreHorizontal, Search } from "lucide-react";
import { format, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { useGetData } from "@/services/queryHooks/useGetData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePostData } from "@/services/queryHooks/usePostData";
import { title } from "process";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
  recipientType: z
    .string()
    .min(1, { message: "Please select recipient type." }),
  recipients: z.array(z.string()).optional(),
  scheduledDate: z.date().optional(),
});

export function SendNotificationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [joinDate, setJoinDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [guestFromDate, setGuestFromDate] = useState<Date | null>(null);
  const [guestToDate, setGuestToDate] = useState<Date | null>(null);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
      recipientType: "all",
      recipients: [],
    },
  });

  const recipientType = form.watch("recipientType");

  const { data: usersData, isLoading: usersLoading } = useGetData(
    "getAllUsers",
    "/admin/getBasicUsersForAdmin",
    recipientType === "selected_users"
  );

  // 3) Artists
  const { data: artistsData, isLoading: artistsLoading } = useGetData(
    "getAllArtists",
    "/admin/getBasicArtistsForAdmin",
    recipientType === "selected_artist"
  );

  const fromDate = guestFromDate ? guestFromDate : subMonths(new Date(), 1);
  const toDate = guestToDate ? guestToDate : new Date();

  const formattedFromDate = format(fromDate, "yyyy-MM-dd");
  const formattedToDate = format(toDate, "yyyy-MM-dd");

  const { data: guestUsers, isLoading } = useGetData(
    "getAllGuestUsers",
    `/admin/notifications/guests?fromDate=${formattedFromDate}&toDate=${formattedToDate}`,
    recipientType === "guest_users"
  );

  const allguestUsers = guestUsers?.data;

  console.log("allguestUsers", allguestUsers);
  const sendNotification = usePostData("/admin/bulk/Notifications/send");

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

  const selectedRecipients = form.watch("recipients") || [];

  const filteredUsers = filteredList.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity =
      cityFilter === "" ||
      user.city?.toLowerCase().includes(cityFilter.toLowerCase());

    const matchesJoinDate =
      !joinDate ||
      format(new Date(user.joinedDate), "yyyy-MM-dd") ===
        format(joinDate, "yyyy-MM-dd");

    return matchesSearch && matchesCity && matchesJoinDate;
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // BACKEND KO JANE WALA JSON BODY
      const payload = {
        type: "tokens",
        tokens: [
          "e-W-vBmF2v9041asR9-uDd:APA91bFMK795rGzcKO_6tyaxES-Cyl84Xzf9ErWkAjcqQAiS0Y2SsYKqBc4E2hgZt5ZQy7sI0k5InRL6XAuE7AC7t_q9mba2B--aDgtMYg14hMQaU0xwFcQ",
          "d_HBV4FlPHAEqXJsAmFwtn:APA91bGGmQOYIfy7ajj-LlN4x6t8VO6mFUECUHnaNfmC1ZJbQ3LsTUSw3vXk_nieeflHnbttCbo-w6a6dJKt2vgNlw47HO7yBL_mVMTuOeoITYTli0hVlN4",
        ], // <-- Tumhare selected users ke IDs
        payload: {
          data: {
            title: values.title,
            body: values.message,
            image: "https://example.com/sample.jpg", // agar form se lena ho to alag field banao
            screen: "booking-details",
            bookingId: "12345",
          },
        },
        meta: {
          screen: "booking-details",
          bookingId: "12345",
          adminId: "121212",
        },
      };

      // API CALL USING REACT QUERY
      const res = await sendNotification.mutateAsync(payload);

      toast({
        title: "Notification Sent!",
        description: "Your notification is successfully delivered.",
      });

      router.push("/notifications");
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to send notification",
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-1">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notification Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter notification title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter notification message"
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Keep the message clear and concise for better engagement.
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
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? format(field.value, "PPP")
                        : "Schedule for later"}
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
                Leave empty to send immediately, or select a date to schedule
                for later.
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
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="customers" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        All Customers
                      </FormLabel>
                    </FormItem>
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
                      <FormLabel className="font-normal">
                        Featured Artists
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="selected_users" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Selected Users
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="selected_artist" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Selected Artists
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="guest_users" />
                      </FormControl>
                      <FormLabel className="font-normal">Guest Users</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(recipientType === "selected_users" ||
            recipientType === "selected_artist") && (
            <div className="space-y-4">
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
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
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
                {recipientType === "selected_users" && (
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">No Booking</SelectItem>
                      <SelectItem value="inactive">1 Booking</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                {recipientType === "selected_artist" && (
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">No Services Added</SelectItem>
                      <SelectItem value="inactive">1 Service added</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <div></div>
              </div>

              <FormDescription>
                Showing {filteredUsers.length} of{" "}
                {recipientType === "selected_users"
                  ? apiUsers.length
                  : apiArtists.length}
                {recipientType === "selected_users" ? "Users" : "Artists"} —
                Select the recipients below.
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
                                <FormItem
                                  key={user.id}
                                  className="flex items-center space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(user.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value || []),
                                              user.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== user.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <div
                                    className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded-md"
                                    onClick={() =>
                                      router.push(`/artists/${user.id}`)
                                    }
                                  >
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage
                                        src={user.avatar || ""}
                                        alt={user.name}
                                      />
                                      <AvatarFallback>
                                        {user.name.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">
                                        {user.name}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {user.email}
                                      </span>
                                    </div>
                                    <Badge variant="outline" className="ml-2">
                                      {user.city}
                                    </Badge>
                                  </div>
                                </FormItem>
                              );
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
                  {selectedRecipients.length} recipient
                  {selectedRecipients.length !== 1 ? "s" : ""} selected
                </div>
              )}
            </div>
          )}
          {recipientType === "guest_users" && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 bg-gray-50 rounded-xl shadow-sm">
              {/* Filters */}
              <div className="flex gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {guestFromDate
                        ? format(guestFromDate, "PPP")
                        : "Filter by From Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={guestFromDate}
                      onSelect={setGuestFromDate}
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {guestToDate
                        ? format(guestToDate, "PPP")
                        : "Filter by To Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={guestToDate}
                      onSelect={setGuestToDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Guest Users Count Card */}
              <div className="flex flex-col items-center justify-center space-y-2 p-6 bg-white rounded-xl shadow-lg min-w-[180px]">
                <h2 className="text-lg font-semibold text-gray-700">
                  Guest Users
                </h2>
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-purple-100">
                  <span className="text-3xl font-bold text-purple-700">
                    {allguestUsers?.count}
                  </span>
                </div>
                <p className="text-gray-500 text-sm text-center">
                  Total number of guest users
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/notifications")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Sending..."
              : form.getValues("scheduledDate")
              ? "Schedule"
              : "Send Now"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
