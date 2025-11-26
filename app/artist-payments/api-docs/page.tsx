"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Copy, ExternalLink, Code, Database, Shield, Zap } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ArtistPaymentAPIDocsPage() {
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Code snippet copied successfully",
    })
  }

  const baseURL = "https://service.app.makeupmunch.in"

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Artist Payment API Documentation</h2>
          <p className="text-muted-foreground mt-2">
            Complete API reference for the Artist Payment & Withdrawal System
          </p>
        </div>
        <Button variant="outline" asChild>
          <a href="#testing-script" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Testing Script
          </a>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              API Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">Total endpoints available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">Database schemas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">JWT</div>
            <p className="text-sm text-muted-foreground">Bearer token authentication</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="artist-apis" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="artist-apis">Artist APIs</TabsTrigger>
          <TabsTrigger value="admin-apis">Admin APIs</TabsTrigger>
          <TabsTrigger value="models">Data Models</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="artist-apis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🏦 Bank Details Management</CardTitle>
              <CardDescription>APIs for managing artist bank account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add/Update Bank Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default">POST</Badge>
                  <code className="text-sm bg-muted px-2 py-1 rounded">/artist-payment/bank-details</code>
                </div>
                <p className="text-sm text-muted-foreground">Add or update artist bank account details with document upload</p>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">cURL Example</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(`curl -X POST "${baseURL}/artist-payment/bank-details" \\
  -H "Authorization: Bearer \${ARTIST_TOKEN}" \\
  -F "artist_id=\${ARTIST_ID}" \\
  -F "account_holder_name=John Doe" \\
  -F "account_number=1234567890" \\
  -F "ifsc_code=SBIN0001234" \\
  -F "bank_name=State Bank of India" \\
  -F "branch_name=Main Branch" \\
  -F "cancelled_cheque=@/path/to/cheque.jpg"`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-xs overflow-x-auto">
{`curl -X POST "${baseURL}/artist-payment/bank-details" \\
  -H "Authorization: Bearer \${ARTIST_TOKEN}" \\
  -F "artist_id=\${ARTIST_ID}" \\
  -F "account_holder_name=John Doe" \\
  -F "account_number=1234567890" \\
  -F "ifsc_code=SBIN0001234" \\
  -F "bank_name=State Bank of India" \\
  -F "branch_name=Main Branch" \\
  -F "cancelled_cheque=@/path/to/cheque.jpg"`}
                  </pre>
                </div>
              </div>

              <Separator />

              {/* Get Bank Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">GET</Badge>
                  <code className="text-sm bg-muted px-2 py-1 rounded">/artist-payment/bank-details/:artist_id</code>
                </div>
                <p className="text-sm text-muted-foreground">Retrieve artist's bank account details</p>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">cURL Example</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(`curl -X GET "${baseURL}/artist-payment/bank-details/\${ARTIST_ID}" \\
  -H "Authorization: Bearer \${ARTIST_TOKEN}"`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-xs overflow-x-auto">
{`curl -X GET "${baseURL}/artist-payment/bank-details/\${ARTIST_ID}" \\
  -H "Authorization: Bearer \${ARTIST_TOKEN}"`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>💰 Withdrawal System</CardTitle>
              <CardDescription>APIs for managing withdrawal requests and earnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Create Withdrawal Request */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default">POST</Badge>
                  <code className="text-sm bg-muted px-2 py-1 rounded">/artist-payment/withdrawal-request</code>
                </div>
                <p className="text-sm text-muted-foreground">Create a new withdrawal request</p>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Request Body</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(`{
  "artist_id": "artist_id_here",
  "points_to_withdraw": 2000,
  "artist_notes": "Monthly withdrawal request"
}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-xs overflow-x-auto">
{`{
  "artist_id": "artist_id_here",
  "points_to_withdraw": 2000,
  "artist_notes": "Monthly withdrawal request"
}`}
                  </pre>
                </div>
              </div>

              <Separator />

              {/* Get Earnings Summary */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">GET</Badge>
                  <code className="text-sm bg-muted px-2 py-1 rounded">/artist-payment/earnings-summary/:artist_id</code>
                </div>
                <p className="text-sm text-muted-foreground">Get artist's earnings and points summary</p>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Response Example</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(`{
  "status": true,
  "message": "Earnings summary fetched successfully",
  "data": {
    "currentPoints": 5000,
    "currentValue": "500.00",
    "totalEarned": "1200.00",
    "totalWithdrawn": "700.00",
    "availableForWithdrawal": "500.00",
    "minWithdrawalAmount": 100,
    "minWithdrawalPoints": 1000
  }
}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-xs overflow-x-auto">
{`{
  "status": true,
  "message": "Earnings summary fetched successfully",
  "data": {
    "currentPoints": 5000,
    "currentValue": "500.00",
    "totalEarned": "1200.00",
    "totalWithdrawn": "700.00",
    "availableForWithdrawal": "500.00",
    "minWithdrawalAmount": 100,
    "minWithdrawalPoints": 1000
  }
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin-apis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>👨‍💼 Admin Management APIs</CardTitle>
              <CardDescription>APIs for admin to manage bank verifications and withdrawal processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bank Verification */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default">POST</Badge>
                  <code className="text-sm bg-muted px-2 py-1 rounded">/admin/artist-payment/verify-bank</code>
                </div>
                <p className="text-sm text-muted-foreground">Verify or reject artist bank details</p>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Request Body</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(`{
  "bank_details_id": "bank_details_id_here",
  "action": "verify",
  "admin_id": "admin_id_here",
  "rejection_reason": "Invalid documents"
}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-xs overflow-x-auto">
{`{
  "bank_details_id": "bank_details_id_here",
  "action": "verify", // or "reject"
  "admin_id": "admin_id_here",
  "rejection_reason": "Invalid documents" // required if action is "reject"
}`}
                  </pre>
                </div>
              </div>

              <Separator />

              {/* Process Withdrawal */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default">POST</Badge>
                  <code className="text-sm bg-muted px-2 py-1 rounded">/admin/artist-payment/process-withdrawal</code>
                </div>
                <p className="text-sm text-muted-foreground">Approve or reject withdrawal requests</p>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Request Body</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(`{
  "request_id": "WR1234567890123",
  "action": "approve",
  "admin_id": "admin_id_here",
  "admin_notes": "Approved for payment",
  "rejection_reason": "Insufficient verification"
}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-xs overflow-x-auto">
{`{
  "request_id": "WR1234567890123",
  "action": "approve", // or "reject"
  "admin_id": "admin_id_here",
  "admin_notes": "Approved for payment",
  "rejection_reason": "Insufficient verification" // required if action is "reject"
}`}
                  </pre>
                </div>
              </div>

              <Separator />

              {/* Mark Payment Completed */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="default">POST</Badge>
                  <code className="text-sm bg-muted px-2 py-1 rounded">/admin/artist-payment/mark-completed</code>
                </div>
                <p className="text-sm text-muted-foreground">Mark withdrawal as completed after bank transfer</p>
                
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Request Body</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(`{
  "request_id": "WR1234567890123",
  "admin_id": "admin_id_here",
  "transaction_id": "TXN123456789",
  "payment_reference": "NEFT123456",
  "admin_notes": "Payment completed via NEFT"
}`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-xs overflow-x-auto">
{`{
  "request_id": "WR1234567890123",
  "admin_id": "admin_id_here",
  "transaction_id": "TXN123456789",
  "payment_reference": "NEFT123456",
  "admin_notes": "Payment completed via NEFT"
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>📋 Database Models</CardTitle>
              <CardDescription>Schema definitions for the payment system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Artist Bank Details */}
              <div className="space-y-3">
                <h4 className="font-semibold">Artist Bank Details</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
{`{
  artist_id: ObjectId,
  account_holder_name: String,
  account_number: String,
  ifsc_code: String,
  bank_name: String,
  branch_name: String,
  verification_status: 'pending' | 'verified' | 'rejected',
  documents: {
    cancelled_cheque: String, // URL
    passbook_front: String    // URL
  },
  rejection_reason: String,
  verified_by: ObjectId,
  verified_at: Date,
  created_at: Date,
  updated_at: Date
}`}
                  </pre>
                </div>
              </div>

              <Separator />

              {/* Withdrawal Request */}
              <div className="space-y-3">
                <h4 className="font-semibold">Withdrawal Request</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
{`{
  request_id: String, // Auto-generated WR + timestamp
  artist_id: ObjectId,
  points_to_withdraw: Number,
  amount_inr: Number,
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected',
  bank_details: {
    account_holder_name: String,
    account_number: String,
    ifsc_code: String,
    bank_name: String,
    branch_name: String
  },
  artist_notes: String,
  admin_notes: String,
  rejection_reason: String,
  transaction_id: String,
  payment_reference: String,
  processed_by: ObjectId,
  processed_at: Date,
  completed_by: ObjectId,
  completed_at: Date,
  created_at: Date,
  updated_at: Date
}`}
                  </pre>
                </div>
              </div>

              <Separator />

              {/* Artist Earnings */}
              <div className="space-y-3">
                <h4 className="font-semibold">Artist Earnings</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
{`{
  artist_id: ObjectId,
  booking_id: ObjectId,
  earning_type: 'booking_completion' | 'loyalty_points' | 'bonus',
  points_earned: Number,
  amount_inr: Number,
  is_withdrawn: Boolean,
  withdrawal_request_id: String,
  description: String,
  created_at: Date,
  updated_at: Date
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card id="testing-script">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Complete Testing Script
              </CardTitle>
              <CardDescription>
                Bash script to test all API endpoints with sample data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">test-artist-payments.sh</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(`#!/bin/bash

# Variables
BASE_URL="https://service.app.makeupmunch.in"
ARTIST_TOKEN="artist_access_token_here"
ADMIN_TOKEN="admin_access_token_here"
ARTIST_ID="artist_id_here"

echo "=========================================="
echo "Testing Artist Payment System"
echo "=========================================="

# Test 1: Add Bank Details
echo -e "\\n[1] Testing Add Bank Details..."
curl -X POST "\${BASE_URL}/artist-payment/bank-details" \\
  -H "Authorization: Bearer \${ARTIST_TOKEN}" \\
  -F "artist_id=\${ARTIST_ID}" \\
  -F "account_holder_name=Test Artist" \\
  -F "account_number=1234567890" \\
  -F "ifsc_code=SBIN0001234" \\
  -F "bank_name=State Bank of India" \\
  -F "branch_name=Test Branch"

# Test 2: Get Earnings Summary
echo -e "\\n[2] Testing Get Earnings Summary..."
curl -X GET "\${BASE_URL}/artist-payment/earnings-summary/\${ARTIST_ID}" \\
  -H "Authorization: Bearer \${ARTIST_TOKEN}"

# Test 3: Create Withdrawal Request
echo -e "\\n[3] Testing Create Withdrawal Request..."
curl -X POST "\${BASE_URL}/artist-payment/withdrawal-request" \\
  -H "Authorization: Bearer \${ARTIST_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "artist_id": "'\${ARTIST_ID}'",
    "points_to_withdraw": 1000,
    "artist_notes": "Test withdrawal"
  }'

# Test 4: Get Pending Verifications (Admin)
echo -e "\\n[4] Testing Get Pending Verifications..."
curl -X GET "\${BASE_URL}/admin/artist-payment/pending-verifications" \\
  -H "Authorization: Bearer \${ADMIN_TOKEN}"

# Test 5: Get Withdrawal Requests (Admin)
echo -e "\\n[5] Testing Get Withdrawal Requests..."
curl -X GET "\${BASE_URL}/admin/artist-payment/withdrawal-requests?status=pending" \\
  -H "Authorization: Bearer \${ADMIN_TOKEN}"

# Test 6: Get Dashboard Stats (Admin)
echo -e "\\n[6] Testing Get Dashboard Stats..."
curl -X GET "\${BASE_URL}/admin/artist-payment/dashboard-stats" \\
  -H "Authorization: Bearer \${ADMIN_TOKEN}"

echo -e "\\n=========================================="
echo "Tests Completed"
echo "=========================================="
`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <pre className="text-xs overflow-x-auto max-h-96">
{`#!/bin/bash

# Variables
BASE_URL="https://service.app.makeupmunch.in"
ARTIST_TOKEN="artist_access_token_here"
ADMIN_TOKEN="admin_access_token_here"
ARTIST_ID="artist_id_here"

echo "=========================================="
echo "Testing Artist Payment System"
echo "=========================================="

# Test 1: Add Bank Details
echo -e "\\n[1] Testing Add Bank Details..."
curl -X POST "\${BASE_URL}/artist-payment/bank-details" \\
  -H "Authorization: Bearer \${ARTIST_TOKEN}" \\
  -F "artist_id=\${ARTIST_ID}" \\
  -F "account_holder_name=Test Artist" \\
  -F "account_number=1234567890" \\
  -F "ifsc_code=SBIN0001234" \\
  -F "bank_name=State Bank of India" \\
  -F "branch_name=Test Branch"

# Test 2: Get Earnings Summary
echo -e "\\n[2] Testing Get Earnings Summary..."
curl -X GET "\${BASE_URL}/artist-payment/earnings-summary/\${ARTIST_ID}" \\
  -H "Authorization: Bearer \${ARTIST_TOKEN}"

# Test 3: Create Withdrawal Request
echo -e "\\n[3] Testing Create Withdrawal Request..."
curl -X POST "\${BASE_URL}/artist-payment/withdrawal-request" \\
  -H "Authorization: Bearer \${ARTIST_TOKEN}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "artist_id": "'\${ARTIST_ID}'",
    "points_to_withdraw": 1000,
    "artist_notes": "Test withdrawal"
  }'

# Test 4: Get Pending Verifications (Admin)
echo -e "\\n[4] Testing Get Pending Verifications..."
curl -X GET "\${BASE_URL}/admin/artist-payment/pending-verifications" \\
  -H "Authorization: Bearer \${ADMIN_TOKEN}"

# Test 5: Get Withdrawal Requests (Admin)
echo -e "\\n[5] Testing Get Withdrawal Requests..."
curl -X GET "\${BASE_URL}/admin/artist-payment/withdrawal-requests?status=pending" \\
  -H "Authorization: Bearer \${ADMIN_TOKEN}"

# Test 6: Get Dashboard Stats (Admin)
echo -e "\\n[6] Testing Get Dashboard Stats..."
curl -X GET "\${BASE_URL}/admin/artist-payment/dashboard-stats" \\
  -H "Authorization: Bearer \${ADMIN_TOKEN}"

echo -e "\\n=========================================="
echo "Tests Completed"
echo "=========================================="
`}
                </pre>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Usage Instructions</h4>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>1. Save the script as <code>test-artist-payments.sh</code></li>
                  <li>2. Replace the token and ID variables with actual values</li>
                  <li>3. Make the script executable: <code>chmod +x test-artist-payments.sh</code></li>
                  <li>4. Run the script: <code>./test-artist-payments.sh</code></li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔄 Complete Workflow Example</CardTitle>
              <CardDescription>Step-by-step workflow from bank setup to payment completion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Step 1</Badge>
                  <span className="font-medium">Artist Bank Setup</span>
                </div>
                <div className="bg-muted p-3 rounded text-sm">
                  Artist adds bank details with documents → Admin verifies → Status: Verified
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Step 2</Badge>
                  <span className="font-medium">Earn Points</span>
                </div>
                <div className="bg-muted p-3 rounded text-sm">
                  Booking completion → Auto-award 1000 points (₹100) → Points credited
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Step 3</Badge>
                  <span className="font-medium">Withdrawal Request</span>
                </div>
                <div className="bg-muted p-3 rounded text-sm">
                  Artist requests withdrawal → Admin approves → Status: Approved
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Step 4</Badge>
                  <span className="font-medium">Payment Processing</span>
                </div>
                <div className="bg-muted p-3 rounded text-sm">
                  Admin processes bank transfer → Marks as completed → Status: Completed
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
