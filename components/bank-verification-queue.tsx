"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Download,
  FileText,
  CreditCard,
  Building
} from "lucide-react"
import { useGetData } from "@/services/queryHooks/useGetData"
import { postData } from "@/services/apiService"
import { useToast } from "@/components/ui/use-toast"

interface BankDetails {
  _id: string
  artist_id: {
    _id: string
    name: string
    email: string
    profile_image?: string
  }
  account_holder_name: string
  account_number: string
  ifsc_code: string
  bank_name: string
  branch_name: string
  verification_status: 'pending' | 'verified' | 'rejected'
  documents: {
    cancelled_cheque?: string
    passbook_front?: string
  }
  created_at: string
  rejection_reason?: string
}

export function BankVerificationQueue() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDetails, setSelectedDetails] = useState<BankDetails | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  
  const { toast } = useToast()
  
  // Replace with actual API call
  const { data: bankDetails, isLoading, refetch } = useGetData(
    "pending-bank-verifications",
    "/admin/artist-payment/pending-verifications"
  )

  // Mock data for development
  const mockBankDetails: BankDetails[] = [
    {
      _id: "bd1",
      artist_id: {
        _id: "artist1",
        name: "Sophia Anderson",
        email: "sophia@example.com",
        profile_image: "/placeholder.svg"
      },
      account_holder_name: "Sophia Anderson",
      account_number: "1234567890",
      ifsc_code: "SBIN0001234",
      bank_name: "State Bank of India",
      branch_name: "Main Branch",
      verification_status: "pending",
      documents: {
        cancelled_cheque: "/documents/cheque1.jpg",
        passbook_front: "/documents/passbook1.jpg"
      },
      created_at: "2024-01-15T10:30:00.000Z"
    },
    {
      _id: "bd2",
      artist_id: {
        _id: "artist2",
        name: "Emma Johnson",
        email: "emma@example.com"
      },
      account_holder_name: "Emma Johnson",
      account_number: "9876543210",
      ifsc_code: "HDFC0002345",
      bank_name: "HDFC Bank",
      branch_name: "City Center",
      verification_status: "pending",
      documents: {
        cancelled_cheque: "/documents/cheque2.jpg"
      },
      created_at: "2024-01-14T15:45:00.000Z"
    }
  ]

  const displayData = bankDetails?.data || mockBankDetails

  const filteredDetails = displayData.filter((detail: BankDetails) =>
    detail.artist_id.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    detail.account_holder_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    detail.bank_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleVerification = async (action: 'verify' | 'reject') => {
    if (!selectedDetails) return

    try {
      setIsProcessing(true)
      
      const payload = {
        bank_details_id: selectedDetails._id,
        action,
        admin_id: "admin_id_here", // Replace with actual admin ID
        ...(action === 'reject' && { rejection_reason: rejectionReason })
      }

      await postData("/admin/artist-payment/verify-bank", payload)
      
      toast({
        title: action === 'verify' ? "Bank Details Verified ✅" : "Bank Details Rejected ❌",
        description: `${selectedDetails.artist_id.name}'s bank details have been ${action}d.`,
      })

      setSelectedDetails(null)
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bank Verification Queue</CardTitle>
        <CardDescription>
          Review and verify artist bank account details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by artist name, account holder, or bank..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artist</TableHead>
                <TableHead>Account Holder</TableHead>
                <TableHead>Bank Details</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDetails.map((detail: BankDetails) => (
                <TableRow key={detail._id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={detail.artist_id.profile_image || "/placeholder.svg"} />
                        <AvatarFallback>
                          {detail.artist_id.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{detail.artist_id.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {detail.artist_id.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{detail.account_holder_name}</div>
                    <div className="text-sm text-muted-foreground">
                      ****{detail.account_number.slice(-4)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        <span className="text-sm">{detail.bank_name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {detail.ifsc_code} • {detail.branch_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {detail.documents.cancelled_cheque && (
                        <Badge variant="outline" className="text-xs">
                          <FileText className="mr-1 h-3 w-3" />
                          Cheque
                        </Badge>
                      )}
                      {detail.documents.passbook_front && (
                        <Badge variant="outline" className="text-xs">
                          <CreditCard className="mr-1 h-3 w-3" />
                          Passbook
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(detail.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(detail.created_at).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      Pending Review
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedDetails(detail)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Bank Details Verification</DialogTitle>
                          <DialogDescription>
                            Review and verify {selectedDetails?.artist_id.name}'s bank account details
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedDetails && (
                          <div className="space-y-6">
                            {/* Artist Info */}
                            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={selectedDetails.artist_id.profile_image || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {selectedDetails.artist_id.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold">{selectedDetails.artist_id.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {selectedDetails.artist_id.email}
                                </div>
                              </div>
                            </div>

                            {/* Bank Details */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Account Holder Name</Label>
                                <div className="mt-1 p-2 bg-muted rounded">
                                  {selectedDetails.account_holder_name}
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Account Number</Label>
                                <div className="mt-1 p-2 bg-muted rounded font-mono">
                                  {selectedDetails.account_number}
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">IFSC Code</Label>
                                <div className="mt-1 p-2 bg-muted rounded font-mono">
                                  {selectedDetails.ifsc_code}
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Bank Name</Label>
                                <div className="mt-1 p-2 bg-muted rounded">
                                  {selectedDetails.bank_name}
                                </div>
                              </div>
                            </div>

                            {/* Documents */}
                            <div>
                              <Label className="text-sm font-medium">Uploaded Documents</Label>
                              <div className="mt-2 space-y-2">
                                {selectedDetails.documents.cancelled_cheque && (
                                  <div className="flex items-center justify-between p-2 border rounded">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4" />
                                      <span>Cancelled Cheque</span>
                                    </div>
                                    <Button variant="outline" size="sm">
                                      <Download className="mr-2 h-4 w-4" />
                                      View
                                    </Button>
                                  </div>
                                )}
                                {selectedDetails.documents.passbook_front && (
                                  <div className="flex items-center justify-between p-2 border rounded">
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="h-4 w-4" />
                                      <span>Passbook Front Page</span>
                                    </div>
                                    <Button variant="outline" size="sm">
                                      <Download className="mr-2 h-4 w-4" />
                                      View
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Rejection Reason (if rejecting) */}
                            <div>
                              <Label htmlFor="rejection-reason">Rejection Reason (Optional)</Label>
                              <Textarea
                                id="rejection-reason"
                                placeholder="Enter reason for rejection..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="mt-1"
                              />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => handleVerification('reject')}
                                disabled={isProcessing}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject
                              </Button>
                              <Button
                                onClick={() => handleVerification('verify')}
                                disabled={isProcessing}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {isProcessing ? "Verifying..." : "Verify & Approve"}
                              </Button>
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

        {filteredDetails.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No pending bank verifications found.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
