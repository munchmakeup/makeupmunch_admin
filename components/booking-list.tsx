"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, Edit, Eye, MoreHorizontal, Search, Trash2, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGetData } from "@/services/queryHooks/useGetData"


export function BookingList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBookings, setSelectedBookings] = useState<string[]>([])

  const { data, isError, isLoading, error } = useGetData("getAllUsers", "admin/getAllBookingsForAdmin")

  const bookings = Array.isArray(data) ? data : []

  const filteredBookings = bookings.filter(
    (booking) =>
      (booking?.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking?.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking?.package?.toLowerCase?.().includes(searchQuery.toLowerCase()) || // optional
        booking?.artistName.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === "all" || booking.status.toLowerCase() === statusFilter.toLowerCase())
  )

  const toggleSelectAll = () => {
    if (selectedBookings.length === filteredBookings?.length) {
      setSelectedBookings([])
    } else {
      setSelectedBookings(filteredBookings.map((booking) => booking.id))
    }
  }

  const toggleSelectBooking = (id: string) => {
    if (selectedBookings.includes(id)) {
      setSelectedBookings(selectedBookings.filter((bookingId) => bookingId !== id))
    } else {
      setSelectedBookings([...selectedBookings, id])
    }
  }




  const router = useRouter()

  const handleViewBooking = (id: string, bookingType: "service" | "package") => {
    console.log("Viewing booking with ID:", id)
    router.push(`/bookings/${id}?bookingType=${bookingType}`)
  }

  const handleEditBooking = (id: string) => {
    router.push(`/bookings/${id}/edit`)
  }


  console.log("datatt,", data)
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bookings..."
              className="pl-8 w-full sm:w-[250px] md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          {selectedBookings.length > 0 && (
            <>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>Confirm</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <XCircle className="h-4 w-4" />
                <span>Cancel</span>
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={selectedBookings.length === filteredBookings?.length && filteredBookings?.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Booking ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Booking Type</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Booking Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings?.map((booking) => (
              <TableRow key={booking.id}
                onClick={() => handleViewBooking(booking.bookingId, booking.bookingType)}
                className="cursor-pointer hover:bg-muted/50 transition"
              >




                <TableCell>
                  <Checkbox
                    checked={selectedBookings.includes(booking.bookingId)}
                    onCheckedChange={() => toggleSelectBooking(booking.bookingId)}
                    aria-label={`Select ${booking.bookingId}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{booking?.bookingId}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{booking?.customerName.charAt(0)?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{booking?.customerName}</span>
                      <span className="text-xs text-muted-foreground">{booking?.customerEmail}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">{booking?.bookingType}</span>

                  {/* {booking.services?.map(service => (
                    <div key={service.serviceName}>
                      <div className="font-medium">{service.serviceName}</div>
                      <ul className="text-sm text-muted-foreground list-disc ml-4">
                        {service.subServices?.map((sub, index) => (
                          <li key={index}>{sub.name} x{sub.quantity}</li>
                        ))}
                      </ul>
                    </div>
                  ))} */}
                </TableCell>

                <TableCell>{booking?.location}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{new Date(booking?.date).toLocaleDateString()}</span>
                    <span className="text-xs text-muted-foreground">{booking?.time}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      booking.BookingStatus === "confirmed"
                        ? "success"
                        : booking.BookingStatus === "pending"
                          ? "outline"
                          : "destructive"
                    }

                  >
                    {booking.BookingStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      booking.PaymentStatus === "paid"
                        ? "success"
                        : booking.PaymentStatus === "pending"
                          ? "outline"
                          : "destructive"
                    }

                  >
                    {booking.PaymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>{booking.amount}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleViewBooking(booking.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditBooking(booking.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      {booking.status === "Pending" && (
                        <DropdownMenuItem>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <span>Confirm</span>
                        </DropdownMenuItem>
                      )}
                      {(booking.status === "Pending" || booking.status === "Confirmed") && (
                        <DropdownMenuItem>
                          <XCircle className="mr-2 h-4 w-4" />
                          <span>Cancel</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
