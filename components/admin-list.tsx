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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, MoreHorizontal, Search, Trash2, UserX } from "lucide-react"
import { useGetData } from "@/services/queryHooks/useGetData"
import { usePutData } from "@/services/queryHooks/usePutData"
import { useToast } from "./ui/use-toast"
import { useRouter } from "next/navigation"



export function AdminList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAdmins, setSelectedAdmins] = useState<number[]>([]);
  const [makeDeactiveId , setMakeDeactiveId] = useState(null)

  const { toast} = useToast();
  const router = useRouter();
    const { data:adminData, isError, isLoading, error } = useGetData("getAllAdmin", "admin/allAdmin");

    const admins = adminData?.data.admins


    console.log("adminData",admins)
  

  const filteredAdmins = admins?.filter(
    (admin) =>
      admin?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin?.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleSelectAll = () => {
    if (selectedAdmins.length === filteredAdmins.length) {
      setSelectedAdmins([])
    } else {
      setSelectedAdmins(filteredAdmins.map((admin) => admin.id))
    }
  }

  const toggleSelectAdmin = (id: number) => {
    if (selectedAdmins.includes(id)) {
      setSelectedAdmins(selectedAdmins.filter((adminId) => adminId !== id))
    } else {
      setSelectedAdmins([...selectedAdmins, id])
    }
  }
  
    // const { mutate: inactiveAdmin, isPending: isUpdating } = usePutData(`/admin/inactivate/${makeDeactiveId}`)

    // const deActivateAdmin = (id)=>{

    //   inactiveAdmin(id, {
    //   onSuccess: (response) => {
    //     toast({
    //       title: "Admin Deactivate successfully",
    //       description: ` has been updated.`,
    //     })
    //     router.push(`/packages/${id}`)
    //   },
    //   onError: (error: any) => {
    //     toast({
    //       title: "Error updating package",
    //       description: error?.message || "Something went wrong. Please try again.",
    //       variant: "destructive",
    //     })
    //   },
    // })
    // }
  

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search admins..."
              className="pl-8 w-[250px] md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedAdmins.length > 0 && (
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <UserX className="h-4 w-4" />
              <span>Deactivate</span>
            </Button>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={selectedAdmins?.length === filteredAdmins?.length && filteredAdmins?.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins?.map((admin) => (
              <TableRow key={admin._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedAdmins.includes(admin.id)}
                    onCheckedChange={() => toggleSelectAdmin(admin.id)}
                    aria-label={`Select ${admin.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={admin.avatar || "/placeholder.svg"} alt={admin.name} />
                      <AvatarFallback>{admin.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{admin.name}</span>
                      <span className="text-xs text-muted-foreground">{admin.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={admin.role === "Super Admin" ? "border-pink-500 text-pink-500" : ""}
                  >
                    {admin.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={admin.status === "active" ? "default" : "secondary"}
                    className={admin.status === "active" ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {admin.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(admin.createdAt).toLocaleString()}</TableCell>
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
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserX className="mr-2 h-4 w-4" />
                        <span 
                        // onClick={deActivateAdmin(admin?._id)}
                        >{admin.status === "active" ? "Deactivate" : "Activate"}</span>
                      </DropdownMenuItem>
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
