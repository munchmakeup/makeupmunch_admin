"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, Phone, Mail, User, Package, CreditCard, FileText } from "lucide-react"
import { useGetData } from "@/services/queryHooks/useGetData"

interface BookingDetailsProps {
  id: string
  bookingType: "service" | "package";
}

export function BookingDetails({ id , bookingType }: BookingDetailsProps) {
  // const [booking, setBooking] = useState<any>(null)
  const [isDataLoading, setIsLoading] = useState(true)

  console.log("Fetching booking data for ID:", id);

  const { data, isLoading, isError, error } = useGetData(
    `bookingDetail_${id}`,
    `/admin/getBookingDetailsById/${id}?bookingType=${bookingType}`
  );

  const apiData = data?.data;

  const booking = bookingType=="package" ? apiData?.packageBooking : apiData?.booking


  // useEffect(() => {
  //   // Simulate API call to fetch booking details
  //   setTimeout(() => {
  //     setBooking({
  //       id: "B-1001",
  //       customer: {
  //         name: "Sophia Anderson",
  //         email: "sophia@example.com",
  //         phone: "+91 9876543210",
  //         avatar: "/placeholder.svg?height=64&width=64",
  //       },
  //       artist: {
  //         name: "Priya Sharma",
  //         email: "priya@example.com",
  //         phone: "+91 9876543211",
  //         avatar: "/placeholder.svg?height=64&width=64",
  //         rating: 4.8,
  //       },
  //       package: {
  //         name: "Bridal Makeup",
  //         description: "Complete bridal makeup with hairstyling and draping",
  //         duration: "4 hours",
  //       },
  //       date: "2023-06-23",
  //       time: "10:00 AM",
  //       status: "Confirmed",
  //       amount: "₹12,500",
  //       location: "123 Main Street, Bandra West, Mumbai, Maharashtra 400050",
  //       notes: "Customer requested natural look with emphasis on eyes. Venue has good lighting.",
  //       paymentStatus: "Paid",
  //       paymentMethod: "UPI",
  //       transactionId: "TXN123456789",
  //       createdAt: "2023-06-20T14:30:00",
  //       updatedAt: "2023-06-21T10:15:00",
  //     })
  //     setIsLoading(false)
  //   }, 1000)
  // }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  if (!booking) {
    return <div>Booking not found</div>
  }

  console.log("bookingbooking", booking)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={booking.user_id?.profile_img || ""} alt={booking.user_id?.username} />
                <AvatarFallback>{booking.user_id?.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{booking.user_id?.username}</h3>
                <p className="text-sm text-muted-foreground">Customer</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{booking.user_id?.email}</span>
              </div> 
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{booking.user_info?.phoneNumber}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Artist Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={booking.artist_id?.profile_img || "/placeholder.svg"} alt={booking.artist_id?.username} />
                <AvatarFallback>{booking.artist_id?.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{booking.artist_id?.businessName}</h3>
                <p className="text-sm text-muted-foreground">Makeup Artist</p>
                <div className="flex items-center gap-1">
                  {/* <span className="text-sm">⭐ {booking.artist.rating}</span> */}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{booking.artist_id?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{booking.artist_id?.phone}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
{bookingType === "package" && (
  <Card className="shadow-sm border rounded-xl">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-semibold">Package Details</CardTitle>
      <p className="text-sm text-muted-foreground">
        Complete package booking information
      </p>
    </CardHeader>

    <CardContent className="space-y-4 pt-2">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-muted-foreground">Package Name</p>
          <p className="font-medium">{booking.package_details?.package_name}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Price</p>
          <p className="font-medium">₹ {booking.package_details?.package_price}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Total Persons</p>
          <p className="font-medium">
            {booking.package_details?.total_persons}
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <p className="font-medium text-sm">Included Services</p>

        {booking.package_details?.services?.map((service: any) => (
          <div
            key={service._id}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <span className="h-2 w-2 rounded-full bg-primary" />
            {service.serviceName}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)}



{bookingType === "service" && (
  <Card className="shadow-sm border rounded-xl">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-semibold">Service Details</CardTitle>
      <p className="text-sm text-muted-foreground">
        Selected services and pricing breakdown
      </p>
    </CardHeader>

    <CardContent className="space-y-5 pt-2">
      {booking.service_details?.map((service: any) => (
        <div
          key={service._id}
          className="rounded-lg border p-3 bg-muted/40 space-y-2"
        >
          <p className="font-medium text-sm">{service.serviceName}</p>

          {service.selected_services?.map((ss: any) => (
            <div
              key={ss._id}
              className="flex items-center justify-between text-sm text-muted-foreground"
            >
              <span>• {ss.subService_name}</span>
              <span className="font-medium">₹{ss.price}</span>
            </div>
          ))}
        </div>
      ))}

      <Separator />

      <div className="flex items-center justify-between text-sm">
        <p className="font-medium">Total Amount</p>
        <p className="font-semibold text-primary">
          ₹{booking.total_amount}
        </p>
      </div>
    </CardContent>
  </Card>
)}


      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Booking Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* <div>
              <h4 className="font-medium mb-2">Services</h4>
              <p className="text-sm font-medium">{booking?.package?.name}</p>
              <p className="text-sm text-muted-foreground">{booking?.package?.description}</p>
              <p className="text-sm text-muted-foreground">Duration: {booking?.package?.duration}</p>
            </div> */}
            <div>
              <h4 className="font-medium mb-2">Status & Amount</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Status:</span>
                  <Badge
                    variant={
                      booking.status === "confirmed"
                        ? "success"
                        : booking.status === "Pending"
                          ? "destructive"
                          : booking.status === "completed"
                            ? "success"
                            : "destructive"
                    }
                   
                  >
                    {booking.status}
                  </Badge>
                </div>
                <p className="text-sm">
                  <span className="font-medium">Amount:</span> {booking.amount}
                </p>
                <div className="w-full flex justify-between">
                  <span className="font-medium">Base Amount: {booking.payment.base_amount}</span> 
                  <span className="font-medium">Additional Amount: {booking.payment.additional_charges}</span> 
                  <span className="font-medium">Total Amount: {booking.payment.total_amount}</span> 
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{booking.booking_time}</span>
              </div>
            </div>
            <div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{booking.location}</span>
              </div>
            </div>
          </div>

          {booking.notes && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">Notes</h4>
                </div>
                <p className="text-sm text-muted-foreground">{booking.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h4 className="font-medium mb-1">Payment Status</h4>
              <Badge variant={
                      booking.payment?.payment_status === "paid"
                        ? "success"
                            : "destructive"
                    }>
                {booking.payment?.payment_status}
              </Badge>
            </div>
            <div>
              <h4 className="font-medium mb-1">Payment Method</h4>
              <p className="text-sm">{booking.payment?.payment_method}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Booking ID</h4>
              <p className="text-sm font-mono">{booking.payment?.booking_id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booking Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Booking Created</p>
                <p className="text-xs text-muted-foreground">{new Date(booking.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-xs text-muted-foreground">{new Date(booking.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
