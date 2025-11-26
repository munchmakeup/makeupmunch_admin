"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  Users, 
  IndianRupee, 
  AlertCircle,
  Clock,
  CheckCircle
} from "lucide-react";
import { useGetData } from "@/services/queryHooks/useGetData";

export function PaymentDashboardStats() {
  const { data: stats, isLoading } = useGetData("payment-dashboard-stats", "/admin/artist-payment/dashboard-stats")

  const mockStats = {
    totalArtists: 156,
    totalEarnings: 2450000,
    pendingWithdrawals: 8,
    pendingAmount: 45000,
    completedWithdrawals: 142,
    completedAmount: 890000,
    pendingVerifications: 3,
    monthlyGrowth: 12.5
  }

  const displayStats = stats || mockStats

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Artists</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{displayStats.totalArtists}</div>
          <p className="text-xs text-muted-foreground">
            +{displayStats.monthlyGrowth}% from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{(displayStats.totalEarnings / 100000).toFixed(1)}L
          </div>
          <p className="text-xs text-muted-foreground">
            Lifetime artist earnings
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{displayStats.pendingWithdrawals}</div>
          <p className="text-xs text-muted-foreground">
            ₹{(displayStats.pendingAmount / 1000).toFixed(0)}K pending
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bank Verifications</CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{displayStats.pendingVerifications}</div>
          <p className="text-xs text-muted-foreground">
            Pending verification
          </p>
        </CardContent>
      </Card>

      {/* Monthly Summary Cards */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">This Month Summary</CardTitle>
          <CardDescription>Payment processing overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Completed Withdrawals</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">{displayStats.completedWithdrawals}</div>
              <div className="text-xs text-muted-foreground">
                ₹{(displayStats.completedAmount / 1000).toFixed(0)}K
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Processing Time</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">2.3 days</div>
              <div className="text-xs text-muted-foreground">Average</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Success Rate</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">98.2%</div>
              <div className="text-xs text-muted-foreground">This month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common payment management tasks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <div className="font-medium">Bank Verifications</div>
              <div className="text-sm text-muted-foreground">
                {displayStats.pendingVerifications} pending reviews
              </div>
            </div>
            <Badge variant="destructive">{displayStats.pendingVerifications}</Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <div className="font-medium">Withdrawal Approvals</div>
              <div className="text-sm text-muted-foreground">
                {displayStats.pendingWithdrawals} requests waiting
              </div>
            </div>
            <Badge variant="outline">{displayStats.pendingWithdrawals}</Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <div className="font-medium">Payment Processing</div>
              <div className="text-sm text-muted-foreground">
                Ready for bank transfer
              </div>
            </div>
            <Badge variant="secondary">5</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
