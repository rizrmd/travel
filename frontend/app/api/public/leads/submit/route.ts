import { NextRequest, NextResponse } from 'next/server'
import { createLead } from '@/lib/data/mock-leads'

/**
 * PUBLIC API Endpoint: Submit Lead from Landing Page
 *
 * POST /api/public/leads/submit
 *
 * Purpose: Allows public visitors to submit their contact information
 * from an agent's landing page. This creates a lead record and should
 * trigger notifications to the agent.
 *
 * Security: This is a PUBLIC endpoint (no auth required)
 * Rate limiting should be implemented in production
 */

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validation
    const { name, phone, agentId, packageId, packageInterest, source, sourceType, landingPageId } = body

    if (!name || !phone || !agentId || !packageId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, phone, agentId, packageId' },
        { status: 400 }
      )
    }

    // Validate phone format (Indonesian)
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/
    const cleanPhone = phone.replace(/\s|-/g, '')
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Validate email if provided
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        )
      }
    }

    // Create lead record
    const newLead = createLead({
      name,
      phone: cleanPhone,
      email: body.email || undefined,
      notes: body.notes || undefined,
      agentId,
      packageId,
      landingPageId,
      packageInterest,
      source,
      sourceType: sourceType || 'landing_page',
    })

    // TODO: In production, this should:
    // 1. Save to database
    // 2. Send WebSocket notification to agent's active session
    // 3. Send WhatsApp notification to agent via WhatsApp API
    // 4. Send email notification to agent
    // 5. Update landing page stats (leads_count++)
    // 6. Log event for analytics

    console.log('✅ New lead created:', newLead.id)
    console.log('📱 TODO: Send WhatsApp notification to agent:', agentId)
    console.log('🔔 TODO: Send WebSocket notification to agent:', agentId)
    console.log('📧 TODO: Send email notification to agent')

    // Return success response
    return NextResponse.json(
      {
        success: true,
        leadId: newLead.id,
        message: 'Lead submitted successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Lead submission error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
