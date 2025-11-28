"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  TrendingUp,
  Users,
  IndianRupee,
  AlertCircle 
} from "lucide-react"
import { BankVerificationQueue } from "@/components/bank-verification-queue"
import { WithdrawalRequestsTable } from "@/components/withdrawal-requests-table"
import { PaymentDashboardStats } from "@/components/payment-dashboard-stats"

export default function ArtistPaymentsPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Artist Payments</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="bank-verification">
            Bank Verification
            <Badge variant="destructive" className="ml-2">3</Badge>
          </TabsTrigger>
          <TabsTrigger value="withdrawal-requests">
            Withdrawal Requests
            <Badge variant="outline" className="ml-2">8</Badge>
          </TabsTrigger>
          <TabsTrigger value="earnings-history">Earnings History</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <PaymentDashboardStats />
        </TabsContent>

        <TabsContent value="bank-verification" className="space-y-4">
          <BankVerificationQueue />
        </TabsContent>

        <TabsContent value="withdrawal-requests" className="space-y-4">
          <WithdrawalRequestsTable />
        </TabsContent>

        <TabsContent value="earnings-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Artist Earnings History</CardTitle>
              <CardDescription>
                Track all artist earnings and point allocations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by artist name or booking ID..."
                    className="pl-8"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="booking_completion">Booking Completion</SelectItem>
                    <SelectItem value="loyalty_points">Loyalty Points</SelectItem>
                    <SelectItem value="bonus">Bonus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Artist</TableHead>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Earning Type</TableHead>
                      <TableHead>Points Earned</TableHead>
                      <TableHead>Amount (₹)</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Sample data - replace with actual API data */}
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>SA</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Sophia Anderson</div>
                            <div className="text-sm text-muted-foreground">sophia@example.com</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">B-1001</TableCell>
                      <TableCell>
                        <Badge variant="outline">Booking Completion</Badge>
                      </TableCell>
                      <TableCell>1000</TableCell>
                      <TableCell>₹100</TableCell>
                      <TableCell>2024-01-15</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Credited
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
