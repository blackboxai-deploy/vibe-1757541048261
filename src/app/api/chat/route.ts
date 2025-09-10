import { NextRequest, NextResponse } from "next/server";

// Business services knowledge base
const businessKnowledge = {
  "business setup": {
    services: ["Trade License", "Company Registration", "MOA & AOA", "Initial Approval", "Bank Account Opening"],
    pricing: "AED 5,000 - AED 15,000 depending on business type",
    requirements: ["Passport copy", "Visa copy", "Emirates ID", "NOC if employed", "Business plan"],
    timeline: "7-14 working days",
    department: "Legal & License Department"
  },
  "vat registration": {
    services: ["VAT Registration", "TRN Application", "VAT Returns Filing", "VAT Compliance"],
    pricing: "AED 1,500 for registration + AED 500/month for filing",
    requirements: ["Trade License", "Emirates ID", "Bank statements", "Lease agreement"],
    timeline: "3-5 working days",
    department: "Tax Department"
  },
  "employment visa": {
    services: ["Work Permit", "Entry Permit", "Medical Test", "Emirates ID", "Labor Card"],
    pricing: "AED 3,000 - AED 5,000 per visa",
    requirements: ["Attested certificates", "Passport", "Photos", "Medical fitness"],
    timeline: "14-21 working days",
    department: "Visa & Tourism Department"
  },
  "golden visa": {
    services: ["10-year Residency", "Multiple Entry", "Family Sponsorship", "Investment Categories"],
    pricing: "AED 15,000 - AED 50,000 depending on category",
    requirements: ["Investment proof", "Salary certificate", "Property documents", "Specialized skills proof"],
    timeline: "30-60 working days",
    department: "Visa & Tourism Department"
  },
  "ejari": {
    services: ["Ejari Registration", "Municipality Services", "DEWA Connection", "Internet Setup"],
    pricing: "AED 800 - AED 1,200",
    requirements: ["Tenancy contract", "Emirates ID", "Passport copy", "Security deposit"],
    timeline: "1-3 working days",
    department: "Legal & License Department"
  }
};

// AI Provider configurations (mock implementations)
const aiProviders = {
  gpt: async (message: string, context: any[]) => {
    // Mock GPT response based on business knowledge
    return generateBusinessResponse(message, context, "gpt");
  },
  grok: async (message: string, context: any[]) => {
    // Mock Grok response
    return generateBusinessResponse(message, context, "grok");
  },
  deepseek: async (message: string, context: any[]) => {
    // Mock DeepSeek response
    return generateBusinessResponse(message, context, "deepseek");
  }
};

function generateBusinessResponse(message: string, context: any[], provider: string) {
  const lowerMessage = message.toLowerCase();
  let response = "";
  let department = "General Info";

  // Determine relevant service and department
  if (lowerMessage.includes("business") || lowerMessage.includes("company") || lowerMessage.includes("license")) {
    const knowledge = businessKnowledge["business setup"];
    response = `I can help you with business setup in Dubai! Here's what you need to know:

📋 **Services Included:**
${knowledge.services.map(s => `• ${s}`).join('\n')}

💰 **Pricing:** ${knowledge.pricing}

📄 **Required Documents:**
${knowledge.requirements.map(r => `• ${r}`).join('\n')}

⏱️ **Timeline:** ${knowledge.timeline}

Would you like me to connect you with our ${knowledge.department} for detailed consultation?`;
    department = knowledge.department;
  }
  else if (lowerMessage.includes("vat") || lowerMessage.includes("tax")) {
    const knowledge = businessKnowledge["vat registration"];
    response = `I'll help you with VAT registration and tax services:

📋 **VAT Services:**
${knowledge.services.map(s => `• ${s}`).join('\n')}

💰 **Pricing:** ${knowledge.pricing}

📄 **Required Documents:**
${knowledge.requirements.map(r => `• ${r}`).join('\n')}

⏱️ **Timeline:** ${knowledge.timeline}

For tax matters, I recommend speaking with our ${knowledge.department}.`;
    department = knowledge.department;
  }
  else if (lowerMessage.includes("visa") && (lowerMessage.includes("employment") || lowerMessage.includes("work"))) {
    const knowledge = businessKnowledge["employment visa"];
    response = `Here's information about Employment Visa services:

📋 **Visa Process:**
${knowledge.services.map(s => `• ${s}`).join('\n')}

💰 **Pricing:** ${knowledge.pricing}

📄 **Required Documents:**
${knowledge.requirements.map(r => `• ${r}`).join('\n')}

⏱️ **Timeline:** ${knowledge.timeline}

Our ${knowledge.department} can guide you through the complete process.`;
    department = knowledge.department;
  }
  else if (lowerMessage.includes("golden visa")) {
    const knowledge = businessKnowledge["golden visa"];
    response = `Golden Visa - 10 Year UAE Residency:

📋 **Benefits:**
${knowledge.services.map(s => `• ${s}`).join('\n')}

💰 **Investment Required:** ${knowledge.pricing}

📄 **Eligibility Documents:**
${knowledge.requirements.map(r => `• ${r}`).join('\n')}

⏱️ **Processing Time:** ${knowledge.timeline}

Contact our ${knowledge.department} for eligibility assessment.`;
    department = knowledge.department;
  }
  else if (lowerMessage.includes("ejari") || lowerMessage.includes("municipality")) {
    const knowledge = businessKnowledge["ejari"];
    response = `Ejari Registration & Municipality Services:

📋 **Services:**
${knowledge.services.map(s => `• ${s}`).join('\n')}

💰 **Cost:** ${knowledge.pricing}

📄 **Required Documents:**
${knowledge.requirements.map(r => `• ${r}`).join('\n')}

⏱️ **Timeline:** ${knowledge.timeline}

Our ${knowledge.department} handles all municipality requirements.`;
    department = knowledge.department;
  }
  else if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("fee")) {
    response = `💰 **SKV Global Business Services - Pricing (AED):**

🏢 **Business Setup:** 5,000 - 15,000
📊 **VAT Registration:** 1,500 + 500/month
🛂 **Employment Visa:** 3,000 - 5,000
👨‍👩‍👧‍👦 **Family Visa:** 4,000 - 6,000
🏆 **Golden Visa:** 15,000 - 50,000
🏠 **Ejari Registration:** 800 - 1,200
💳 **Labor Card:** 1,200 - 2,000
🏦 **Bank Account Opening:** 2,000 - 3,000

*Prices may vary based on specific requirements. Contact us for detailed quotation.*`;
    department = "General Info";
  }
  else {
    response = `Hello! I'm SKV.ChatGB, your AI assistant for UAE business services. I can help you with:

🏢 **Business Setup & Registration**
📊 **Tax & VAT Services**
🛂 **Visa Services (Employment, Family, Golden)**
🏠 **Ejari & Municipality Services**
💳 **Labor Card & Work Permits**
🏦 **Bank Account Opening**
📋 **Document Attestation**
🏗️ **Freezone Company Setup**

What specific service would you like to know about?

📧 **Contact:** info@skvbusiness.com
🌐 **Website:** www.skvbusiness.com
📍 **Location:** Dubai, UAE`;
    department = "General Info";
  }

  // Add provider-specific styling
  if (provider === "grok") {
    response += "\n\n⚡ *Powered by Grok AI - Fast & Efficient*";
  } else if (provider === "deepseek") {
    response += "\n\n🔍 *Powered by DeepSeek - Deep Analysis*";
  } else {
    response += "\n\n🤖 *Powered by ChatGPT - Comprehensive Support*";
  }

  return { response, department };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, aiProvider = "gpt", language = "en", context = [] } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get AI response based on selected provider
    const aiResponse = await aiProviders[aiProvider as keyof typeof aiProviders](message, context);

    // Return response with department information
    return NextResponse.json({
      response: aiResponse.response,
      department: aiResponse.department,
      aiProvider,
      language,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { 
        error: "Failed to process chat message",
        response: "I'm experiencing technical difficulties. Please contact our support team at info@skvbusiness.com or try again later."
      },
      { status: 500 }
    );
  }
}