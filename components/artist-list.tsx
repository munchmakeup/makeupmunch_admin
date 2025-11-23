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
import { CheckCircle, Edit, Eye, Filter, MoreHorizontal, Search, Star, Trash2, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGetData } from "@/services/queryHooks/useGetData"
import { ShieldCheck } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"


export function ArtistList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedArtists, setSelectedArtists] = useState<number[]>([]);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
const [selectedCity, setSelectedCity] =useState([]);


  const { data, isError, isLoading, error } = useGetData("getAllUsers", "admin/getAllArtistsForAdmin");

  const apiArtists = Array.isArray(data?.data) ? data.data : [];

console.log("apiArtists", apiArtists);

    const allSpecialities = Array.from(new Set((data?.data || []).flatMap((item: any) => item.specialties || [])))

    const allCities = Array.from(new Set((data?.data || []).map((item: any) => item.city || [])))

    console.log("allCities", allCities);
    


 const filteredArtists = apiArtists.filter((artist) => {
  // Match search query
  const matchesSearch =
    artist?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist?.specialties.join(", ").toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist?.city.toLowerCase().includes(searchQuery.toLowerCase());

  // Match status filter
  const matchesStatus = statusFilter === "all" || artist?.Status.toLowerCase() === statusFilter.toLowerCase();

  // Match selected services
  const matchesServices =
    selectedServices.length === 0 || // If no services selected, match all
    selectedServices.some((specialties) => artist?.specialties?.includes(specialties)); // artist.services must contain at least one selected service
  const matchesCities = 
    selectedCity.length ===0 || 
    selectedCity.some((city)=>artist?.city.includes(city))
  return matchesSearch && matchesStatus && matchesServices && matchesCities;
});

  const toggleSelectAll = () => {
    if (selectedArtists.length === filteredArtists.length) {
      setSelectedArtists([])
    } else {
      setSelectedArtists(filteredArtists.map((artist) => artist.id))
    }
  }

  const toggleSelectArtist = (id: number) => {
    if (selectedArtists.includes(id)) {
      setSelectedArtists(selectedArtists.filter((artistId) => artistId !== id))
    } else {
      setSelectedArtists([...selectedArtists, id])
    }
  }


  const router = useRouter()

  const handleViewProfile = (id: number) => {
    router.push(`/artists/${id}`)
  }

  const handleEditArtist = (id: number) => {
    router.push(`/artists/${id}/edit`)
  }



  // Loading state
if (isLoading) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Skeleton className="h-10 w-[300px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Skeleton className="h-4 w-4" />
              </TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-4" />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>

                <TableCell>
                  <Skeleton className="h-6 w-20" />
                </TableCell>

                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-red-500 mb-2">Error loading packages</div>
        <p className="text-muted-foreground mb-4">{error?.message || "Something went wrong while fetching packages"}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search artists..."
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
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-[200px] justify-start">
                <Filter className="mr-2 h-4 w-4" />
                {selectedServices.length > 0
                  ? `${selectedServices.length} service${selectedServices.length > 1 ? "s" : ""} selected`
                  : "Filter by services"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-64 overflow-auto w-56">
              <DropdownMenuLabel>Select Services</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allSpecialities.map((specialties) => (
                <DropdownMenuItem
                  key={specialties}
                  onClick={() => {
                    if (selectedServices.includes(specialties)) {
                      setSelectedServices(selectedServices.filter((s) => s !== specialties))
                    } else {
                      setSelectedServices([...selectedServices, specialties])
                    }
                  }}
                  className="cursor-pointer"
                >
                  <Checkbox className="mr-2" checked={selectedServices.includes(specialties)} readOnly />
                  {specialties}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-[200px] justify-start">
                <Filter className="mr-2 h-4 w-4" />
                {selectedCity.length > 0
                  ? `${selectedCity.length} City selected`
                  : "Filter by Cities"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-64 overflow-auto w-56">
              <DropdownMenuLabel>Select Cities</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allCities.map((city) => (
                <DropdownMenuItem
                  key={city}
                  onClick={() => {
                    if (selectedCity.includes(city)) {
                      setSelectedCity(selectedCity.filter((c) => c !== city))
                    } else {
                      setSelectedCity([...selectedCity, city])
                    }
                  }}
                  className="cursor-pointer"
                >
                  <Checkbox className="mr-2" checked={selectedCity.includes(city)} readOnly />
                  {city}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          {selectedArtists.length > 0 && (
            <>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>Approve</span>
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <XCircle className="h-4 w-4" />
                <span>Reject</span>
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
                  checked={selectedArtists.length === filteredArtists.length && filteredArtists.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArtists.map((artist) => (
              <TableRow key={artist?._id} onClick={() => handleViewProfile(artist?._id)}>
                <TableCell>
                  <Checkbox
                    checked={selectedArtists.includes(artist?._id)}
                    onCheckedChange={() => toggleSelectArtist(artist?._id)}
                    aria-label={`Select ${artist?.username}`}
                  />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={artist?.profile_img || ""} alt={artist?.username} />
                      <AvatarFallback>{artist?.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium flex items-center gap-1">
                          {artist?.username}
                          {artist?.providedByUs && (
                            <span title="Hub Provided">
                              <ShieldCheck className="text-green-500 h-4 w-4" />
                            </span>
                          )}
                        </span>

                        {artist?.featured && (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{artist?.email}</span>
                    </div>
                  </div>
                </TableCell>                <TableCell>{artist?.specialties?.[0]}</TableCell>
                <TableCell>{artist?.city}</TableCell>

                <TableCell>
                  <div className="flex items-center">
                    <span>{new Date(artist?.joinedDate).toLocaleString()}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={
                      artist?.Status === "approved" ? "default" : artist?.Status === "Pending" ? "outline" : "destructive"
                    }
                    className={
                      artist?.Status === "approved"
                        ? "bg-green-500 hover:bg-green-600"
                        : artist?.Status === "Pending"
                          ? "border-yellow-500 text-yellow-500"
                          : ""
                    }
                  >
                    {artist?.Status}
                  </Badge>
                </TableCell>
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
                      <DropdownMenuItem onClick={() => handleEditArtist(artist?._id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      {artist.status !== "Approved" && (
                        <DropdownMenuItem>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          <span>Approve</span>
                        </DropdownMenuItem>
                      )}
                      {artist.status !== "Rejected" && (
                        <DropdownMenuItem>
                          <XCircle className="mr-2 h-4 w-4" />
                          <span>Reject</span>
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
