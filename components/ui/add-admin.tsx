"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { usePostData } from "@/services/queryHooks/usePostData"

// ------------------------
// SCHEMA
// ------------------------

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  phoneNumber: z.string().min(10, "Phone must be at least 10 digits."),
  role: z.string().min(1, "Select role."),
  status: z.string().min(1, "Select status."),
  permissions: z.array(z.string()).nonempty("Select at least one permission.")
})

// -------------------------
// PERMISSIONS LIST
// -------------------------

const permissionsList = [
  { id: "send-notification", label: "Send Notification" },
  { id: "view-users", label: "View Users" },
  { id: "manage-artists", label: "Manage Artists" },
  { id: "manage-bookings", label: "Manage Bookings" },
]

export function AddAdminForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      role: "",
      status: "",
      permissions: [],
    },
  })

  // -------------------------
  // SUBMIT HANDLER
  // -------------------------
  const createAdmin = usePostData("/admin/create");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try{

        const payload= {
             name: values.name,
      email: values.email,
      password: values.password,
      phoneNumber:values.phoneNumber,
      role: values.role,
      status: values.status,
      permissions: values.permissions,
        }

    const res = await createAdmin.mutateAsync(payload);
    
          toast({
            title: "Notification Sent!",
            description: "Your notification is successfully delivered.",
          });
    
          router.push("/admin-management");
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
        
        {/* -------------------- TOP FIELDS -------------------- */}
        
        <div className="grid gap-6 md:grid-cols-2">
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="user@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+91 9876543210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter secure password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ROLE */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* STATUS */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>

        <Separator />

        {/* -------------------- PERMISSIONS -------------------- */}

        <div>
          <h3 className="mb-4 text-sm font-medium">Permissions</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {permissionsList.map((perm) => (
              <FormField
                key={perm.id}
                control={form.control}
                name="permissions"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(perm.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, perm.id])
                            : field.onChange(field.value?.filter((v) => v !== perm.id))
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{perm.label}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormMessage>{form.formState.errors.permissions?.message}</FormMessage>
        </div>

        {/* -------------------- ACTION BUTTONS -------------------- */}

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.push("/users")}>
            Cancel
          </Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
