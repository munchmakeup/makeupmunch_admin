"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Search, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  IndianRupee,
  CreditCard,
  Building,
  Calendar
} from "lucide-react"
import { useGetData } from "@/services/queryHooks/useGetData"
import { postData } from "@/services/apiService"
import { useToast } from "@/components/ui/use-toast"

interface WithdrawalRequest {
  _id: string
  request_id: string
  artist_id: {
    _id: string
    name: string
    email: string
    profile_image?: string
  }
  points_to_withdraw: number
  amount_inr: number
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected'
  bank_details: {
    account_holder_name: string
    account_number: string
    ifsc_code: string
    bank_name: string
    branch_name: string
  }
  artist_notes?: string
  admin_notes?: string
  rejection_reason?: string
  transaction_id?: string
  payment_reference?: string
  created_at: string
  processed_at?: string
  completed_at?: string
}

export function WithdrawalRequestsTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [paymentReference, setPaymentReference] = useState("")
  
  const { toast } = useToast()
  
  // Replace with actual API call
  const { data: withdrawalRequests, isLoading, refetch } = useGetData(
    "withdrawal-requests",
    `/admin/artist-payment/withdrawal-requests?status=${statusFilter}`
  )

  // Mock data for development
  const mockRequests: WithdrawalRequest[] = [
    {
      _id: "wr1",
      request_id: "WR1234567890123",
      artist_id: {
        _id: "artist1",
        name: "Sophia Anderson",
        email: "sophia@example.com",
        profile_image: "/placeholder.svg"
      },
      points_to_withdraw: 2000,
      amount_inr: 200,
      status: "pending",
      bank_details: {
        account_holder_name: "Sophia Anderson",
        account_number: "1234567890",
        ifsc_code: "SBIN0001234",
        bank_name: "State Bank of India",
        branch_name: "Main Branch"
      },
      artist_notes: "Monthly withdrawal request",
      created_at: "2024-01-15T10:30:00.000Z"
    },
    {
      _id: "wr2",
      request_id: "WR1234567890124",
      artist_id: {
        _id: "artist2",
        name: "Emma Johnson",
        email: "emma@example.com"
      },
      points_to_withdraw: 5000,
      amount_inr: 500,
      status: "approved",
      bank_details: {
        account_holder_name: "Emma Johnson",
        account_number: "9876543210",
        ifsc_code: "HDFC0002345",
        bank_name: "HDFC Bank",
        branch_name: "City Center"
      },
      admin_notes: "Approved for payment processing",
      created_at: "2024-01-14T15:45:00.000Z",
      processed_at: "2024-01-15T09:30:00.000Z"
    },
    {
      _id: "wr3",
      request_id: "WR1234567890125",
      artist_id: {
        _id: "artist3",
        name: "Olivia Williams",
        email: "olivia@example.com"
      },
      points_to_withdraw: 3000,
      amount_inr: 300,
      status: "completed",
      bank_details: {
        account_holder_name: "Olivia Williams",
        account_number: "5555666677",
        ifsc_code: "ICIC0003456",
        bank_name: "ICICI Bank",
        branch_name: "Business Park"
      },
      transaction_id: "TXN123456789",
      payment_reference: "NEFT123456",
      admin_notes: "Payment completed via NEFT",
      created_at: "2024-01-13T12:20:00.000Z",
      completed_at: "2024-01-15T14:45:00.000Z"
    }
  ]

  const displayData = withdrawalRequests?.data.requests || mockRequests

  const filteredRequests = displayData.filter((request: WithdrawalRequest) => {
    const matchesSearch = 
      request.artist_id.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.request_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.bank_details.account_holder_name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleProcessRequest = async (action: 'approve' | 'reject') => {
    if (!selectedRequest) return

    try {
      setIsProcessing(true)
      
      const payload = {
        request_id: selectedRequest.request_id,
        action,
        admin_id: "admin_id_here", // Replace with actual admin ID
        admin_notes: adminNotes,
        ...(action === 'reject' && { rejection_reason: rejectionReason })
      }

      await postData("/admin/artist-payment/process-withdrawal", payload)
      
      toast({
        title: action === 'approve' ? "Request Approved ✅" : "Request Rejected ❌",
        description: `Withdrawal request has been ${action}d successfully.`,
      })

      setSelectedRequest(null)
      setAdminNotes("")
      setRejectionReason("")
      refetch()
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMarkCompleted = async () => {
    if (!selectedRequest) return

    try {
      setIsProcessing(true)
      
      const payload = {
        request_id: selectedRequest.request_id,
        admin_id: "admin_id_here", // Replace with actual admin ID
        transaction_id: transactionId,
        payment_reference: paymentReference,
        admin_notes: adminNotes
      }

      await postData("/admin/artist-payment/mark-completed", payload)
      
      toast({
        title: "Payment Completed ✅",
        description: "Withdrawal has been marked as completed successfully.",
      })

      setSelectedRequest(null)
      setAdminNotes("")
      setTransactionId("")
      setPaymentReference("")
      refetch()
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "outline" as const, className: "text-orange-600 border-orange-600", icon: Clock },
      approved: { variant: "outline" as const, className: "text-blue-600 border-blue-600", icon: CheckCircle },
      processing: { variant: "outline" as const, className: "text-purple-600 border-purple-600", icon: Clock },
      completed: { variant: "default" as const, className: "bg-green-500 hover:bg-green-600", icon: CheckCircle },
      rejected: { variant: "destructive" as const, className: "", icon: XCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="mr-1 h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal Requests</CardTitle>
        <CardDescription>
          Manage artist withdrawal requests and payment processing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by artist name, request ID, or account holder..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artist</TableHead>
                <TableHead>Request ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Bank Details</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request: WithdrawalRequest) => (
                <TableRow key={request._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={request.artist_id.profile_image || "/placeholder.svg"} />
                        <AvatarFallback>
                          {request.artist_id.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{request.artist_id.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {request.artist_id.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">{request.request_id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-semibold">₹{request.amount_inr}</div>
                      <div className="text-xs text-muted-foreground">
                        {request.points_to_withdraw} points
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{request.bank_details.account_holder_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {request.bank_details.bank_name}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        ****{request.bank_details.account_number.slice(-4)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(request.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(request.created_at).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(request.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {request.status === 'pending' ? 'Review' : 
                           request.status === 'approved' ? 'Process' : 'View'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Withdrawal Request Details</DialogTitle>
                          <DialogDescription>
                            {selectedRequest?.status === 'pending' ? 'Review and process' : 
                             selectedRequest?.status === 'approved' ? 'Mark payment as completed' : 'View'} withdrawal request
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedRequest && (
                          <div className="space-y-6">
                            {/* Request Info */}
                            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={selectedRequest.artist_id.profile_image || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {selectedRequest.artist_id.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="font-semibold">{selectedRequest.artist_id.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {selectedRequest.artist_id.email}
                                </div>
                                <div className="text-xs text-muted-foreground font-mono mt-1">
                                  {selectedRequest.request_id}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold">₹{selectedRequest.amount_inr}</div>
                                <div className="text-sm text-muted-foreground">
                                  {selectedRequest.points_to_withdraw} points
                                </div>
                              </div>
                            </div>

                            {/* Bank Details */}
                            <div>
                              <Label className="text-sm font-medium">Bank Account Details</Label>
                              <div className="mt-2 grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-xs text-muted-foreground">Account Holder</div>
                                  <div className="font-medium">{selectedRequest.bank_details.account_holder_name}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">Account Number</div>
                                  <div className="font-mono">{selectedRequest.bank_details.account_number}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">IFSC Code</div>
                                  <div className="font-mono">{selectedRequest.bank_details.ifsc_code}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">Bank & Branch</div>
                                  <div>{selectedRequest.bank_details.bank_name}</div>
                                  <div className="text-sm text-muted-foreground">{selectedRequest.bank_details.branch_name}</div>
                                </div>
                              </div>
                            </div>

                            {/* Artist Notes */}
                            {selectedRequest.artist_notes && (
                              <div>
                                <Label className="text-sm font-medium">Artist Notes</Label>
                                <div className="mt-1 p-2 bg-muted rounded text-sm">
                                  {selectedRequest.artist_notes}
                                </div>
                              </div>
                            )}

                            {/* Status-specific fields */}
                            {selectedRequest.status === 'pending' && (
                              <>
                                <div>
                                  <Label htmlFor="admin-notes">Admin Notes</Label>
                                  <Textarea
                                    id="admin-notes"
                                    placeholder="Add notes for this request..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="rejection-reason">Rejection Reason (if rejecting)</Label>
                                  <Textarea
                                    id="rejection-reason"
                                    placeholder="Enter reason for rejection..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                              </>
                            )}

                            {selectedRequest.status === 'approved' && (
                              <>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="transaction-id">Transaction ID</Label>
                                    <Input
                                      id="transaction-id"
                                      placeholder="Enter transaction ID..."
                                      value={transactionId}
                                      onChange={(e) => setTransactionId(e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="payment-reference">Payment Reference</Label>
                                    <Input
                                      id="payment-reference"
                                      placeholder="Enter payment reference..."
                                      value={paymentReference}
                                      onChange={(e) => setPaymentReference(e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="completion-notes">Completion Notes</Label>
                                  <Textarea
                                    id="completion-notes"
                                    placeholder="Add notes about the payment completion..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                              </>
                            )}

                            {/* Existing admin notes */}
                            {selectedRequest.admin_notes && (
                              <div>
                                <Label className="text-sm font-medium">Previous Admin Notes</Label>
                                <div className="mt-1 p-2 bg-muted rounded text-sm">
                                  {selectedRequest.admin_notes}
                                </div>
                              </div>
                            )}

                            {/* Transaction details for completed requests */}
                            {selectedRequest.status === 'completed' && (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Transaction ID</Label>
                                  <div className="mt-1 p-2 bg-muted rounded font-mono text-sm">
                                    {selectedRequest.transaction_id}
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Payment Reference</Label>
                                  <div className="mt-1 p-2 bg-muted rounded font-mono text-sm">
                                    {selectedRequest.payment_reference}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2">
                              {selectedRequest.status === 'pending' && (
                                <>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleProcessRequest('reject')}
                                    disabled={isProcessing}
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject
                                  </Button>
                                  <Button
                                    onClick={() => handleProcessRequest('approve')}
                                    disabled={isProcessing}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    {isProcessing ? "Processing..." : "Approve"}
                                  </Button>
                                </>
                              )}
                              
                              {selectedRequest.status === 'approved' && (
                                <Button
                                  onClick={handleMarkCompleted}
                                  disabled={isProcessing || !transactionId}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  {isProcessing ? "Completing..." : "Mark as Completed"}
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No withdrawal requests found.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
