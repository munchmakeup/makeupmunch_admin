"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Clock, Package, MapPin, Star, Activity, CreditCard } from "lucide-react"
import { useGetData } from "@/services/queryHooks/useGetData"
import { useRouter } from "next/navigation"

interface PackageDetailsProps {
  id: string
}





export function PackageDetails({ id }: PackageDetailsProps) {

  const [packageData, setPackageData] = useState<any>(null)

  const [isDataLoading, setIsLoading] = useState(true)

  const router = useRouter()



  const { data, isLoading, isError, error } = useGetData(`packageDetail_${id}`, `/admin/packages/${id}`)
  const packageInfo = data?.data.package || []
  const totalBookings = data?.data.totalBookings || []
  const totalRevenue = data?.data.totalRevenue || []
  const bookings = data?.data.bookings || []


  const handleViewBooking = (id: string, bookingType: "service" | "package") => {
    console.log("Viewing booking with ID:", id)
    router.push(`/bookings/${id}?bookingType=${bookingType}`)
  }




  useEffect(() => {
    // Simulate API call to fetch package details
    setTimeout(() => {
      setPackageData({
        id: "P-1001",
        name: packageInfo.name,
        category: packageInfo.category || "General",
        price: `₹${packageInfo.price}`,
        duration: packageInfo.duration || "2 hours",
        description:
          packageInfo.description ||
          "No description available for this package.",
        status: packageInfo.status || "status not available",
        featured: packageInfo.featured ?? false,
        inclusions: packageInfo.services || [],

        cities: packageInfo.cities || [],
        totalBookings: totalBookings || "no bookings",
        totalRevenue: totalRevenue || "no revenue",
        averageRating: 0.0,
        createdAt: packageInfo.createdAt,
        updatedAt: packageInfo.updatedAt,
        recentBookings: bookings


        // [
        //   {
        //     id: "B-1001",
        //     customer: "Sophia Anderson",
        //     artist: "Priya Sharma",
        //     date: "2023-06-23",
        //     status: "Completed",
        //     amount: "₹25,000",
        //   },
        //   {
        //     id: "B-1002",
        //     customer: "Emma Johnson",
        //     artist: "Neha Patel",
        //     date: "2023-06-20",
        //     status: "Completed",
        //     amount: "₹25,000",
        //   },
        //   {
        //     id: "B-1003",
        //     customer: "Olivia Williams",
        //     artist: "Anjali Gupta",
        //     date: "2023-06-18",
        //     status: "Completed",
        //     amount: "₹25,000",
        //   },
        // ],
      })
      setIsLoading(false)
    }, 1000)
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  if (!packageData) {
    return <div>Package not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-pink-600 mx-auto mb-4">
              <Package className="h-8 w-8" />
            </div>
            <CardTitle>{packageData.name}</CardTitle>
            <CardDescription>{packageData.category}</CardDescription>
            <div className="flex items-center justify-center gap-2">
              <Badge
                variant={packageData.status === "active" ? "success" : "destructive"}
              >
                {packageData.status}
              </Badge>
              {packageData.featured && <Badge className="bg-yellow-500 hover:bg-yellow-600">Featured</Badge>}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{packageData.price}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{packageData.duration}</span>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span>Created {new Date(packageData.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span>Updated {new Date(packageData.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Package Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{packageData.totalBookings != 0 ? packageData.totalBookings : "No Bookings"}</div>
                <div className="text-sm text-muted-foreground">Total Bookings</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{packageData.totalRevenue != 0 ? packageData.totalRevenue : "No Revenue"}</div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
                  <Star className="h-5 w-5" />
                  {packageData.averageRating}
                </div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{packageData.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Package Inclusions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {packageData.inclusions.map((inclusion: string, index: number) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{inclusion}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Cities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {packageData.cities.map((city: string, index: number) => (
              <Badge key={index} variant="outline" className="text-sm">
                <MapPin className="h-3 w-3 mr-1" />
                {city}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest bookings for this package</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>

                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packageData.recentBookings.map((booking: any) => (
                <TableRow key={booking.id}
                  onClick={() => handleViewBooking(booking._id, 'package')}
                  className="cursor-pointer hover:bg-muted/50 transition"
                >
                  <TableCell className="font-medium">{booking.payment.booking_id}</TableCell>
                  <TableCell>{booking.user_info.user_Fname}</TableCell>
                  <TableCell>{new Date(booking.booking_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={booking.status === "confirmed" ? "success" : "destructive"}
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={booking.payment.payment_status === "paid" ? "success" : "destructive"}
                    >
                      {booking.payment.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{booking.payment.total_amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
