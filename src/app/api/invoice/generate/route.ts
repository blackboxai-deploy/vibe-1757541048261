import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const invoiceData = await request.json();

    // Validate required fields
    if (!invoiceData.clientName || !invoiceData.services || invoiceData.services.length === 0) {
      return NextResponse.json(
        { error: "Client name and services are required" },
        { status: 400 }
      );
    }

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`;
    const currentDate = new Date();

    // Create HTML invoice template
    const invoiceHTML = generateInvoiceHTML(invoiceData, invoiceNumber, currentDate);

    // In a real application, you would:
    // 1. Convert HTML to PDF using libraries like puppeteer or jsPDF
    // 2. Save to cloud storage
    // 3. Send email notification
    // 4. Update database with invoice record

    // Mock PDF generation response
    const mockPdfUrl = `data:text/html;base64,${Buffer.from(invoiceHTML).toString('base64')}`;

    // Create invoice record
    const invoice = {
      id: invoiceNumber,
      clientName: invoiceData.clientName,
      clientEmail: invoiceData.clientEmail,
      services: invoiceData.services,
      subtotal: invoiceData.subtotal,
      tax: invoiceData.tax,
      total: invoiceData.total,
      paymentTerms: invoiceData.paymentTerms,
      notes: invoiceData.notes,
      createdDate: currentDate.toISOString(),
      dueDate: new Date(currentDate.getTime() + (parseInt(invoiceData.paymentTerms) * 24 * 60 * 60 * 1000)).toISOString(),
      status: "pending",
      currency: "AED"
    };

    return NextResponse.json({
      success: true,
      message: "Invoice generated successfully",
      invoice: invoice,
      invoiceUrl: mockPdfUrl,
      downloadUrl: `/api/invoice/download/${invoiceNumber}`
    });

  } catch (error) {
    console.error("Invoice generation error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate invoice",
        details: "Please try again or contact support if the problem persists."
      },
      { status: 500 }
    );
  }
}

function generateInvoiceHTML(data: any, invoiceNumber: string, date: Date) {
  const dueDate = new Date(date.getTime() + (parseInt(data.paymentTerms) * 24 * 60 * 60 * 1000));

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
        .header { background: #1e3a8a; color: white; padding: 20px; margin: -20px -20px 30px -20px; }
        .company-info { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 24px; font-weight: bold; }
        .invoice-details { margin: 20px 0; }
        .client-info { margin: 20px 0; background: #f8f9fa; padding: 15px; border-radius: 8px; }
        .services-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .services-table th, .services-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .services-table th { background: #1e3a8a; color: white; }
        .totals { margin: 20px 0; text-align: right; }
        .total-line { margin: 5px 0; }
        .final-total { font-size: 18px; font-weight: bold; color: #1e3a8a; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #1e3a8a; }
        .payment-info { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          <div>
            <div class="logo">SKV Global Business Services LLC</div>
            <div>Dubai, United Arab Emirates</div>
            <div>Email: info@skvbusiness.com</div>
            <div>Website: www.skvbusiness.com</div>
          </div>
          <div>
            <h1 style="margin: 0;">INVOICE</h1>
            <div>Invoice #: ${invoiceNumber}</div>
            <div>Date: ${date.toLocaleDateString()}</div>
            <div>Due: ${dueDate.toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div class="client-info">
        <h3>Bill To:</h3>
        <strong>${data.clientName}</strong><br>
        ${data.clientEmail ? `Email: ${data.clientEmail}<br>` : ''}
        ${data.clientAddress ? data.clientAddress.replace(/\n/g, '<br>') : ''}
      </div>

      <table class="services-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price (AED)</th>
            <th>Total (AED)</th>
          </tr>
        </thead>
        <tbody>
          ${data.services.map((service: any) => `
            <tr>
              <td>${service.service}</td>
              <td>${service.description}</td>
              <td>${service.quantity}</td>
              <td>${service.unitPrice.toFixed(2)}</td>
              <td>${service.total.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <div class="total-line">Subtotal: AED ${data.subtotal.toFixed(2)}</div>
        <div class="total-line">VAT (5%): AED ${data.tax.toFixed(2)}</div>
        <div class="total-line final-total">Total: AED ${data.total.toFixed(2)}</div>
      </div>

      <div class="payment-info">
        <h3>Payment Information</h3>
        <p><strong>Payment Terms:</strong> ${data.paymentTerms} days</p>
        <p><strong>Accepted Payment Methods:</strong></p>
        <ul>
          <li>Bank Transfer: Contact us for banking details</li>
          <li>PayPal: Available upon request</li>
          <li>Cryptocurrency: Bitcoin, Ethereum accepted</li>
        </ul>
      </div>

      ${data.notes ? `
        <div class="payment-info">
          <h3>Notes:</h3>
          <p>${data.notes.replace(/\n/g, '<br>')}</p>
        </div>
      ` : ''}

      <div class="footer">
        <h3>Department Contacts:</h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
          <div>
            <strong>Tax Department:</strong><br>
            mohit@skvbusiness.com
          </div>
          <div>
            <strong>Legal & License:</strong><br>
            sunil@skvbusiness.com
          </div>
          <div>
            <strong>Global Business Setup:</strong><br>
            nikita@skvbusiness.com
          </div>
          <div>
            <strong>Visa & Tourism:</strong><br>
            rahul@skvbusiness.com
          </div>
        </div>
        <p style="text-align: center; margin-top: 20px; color: #666;">
          Thank you for choosing SKV Global Business Services LLC
        </p>
      </div>
    </body>
    </html>
  `;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}