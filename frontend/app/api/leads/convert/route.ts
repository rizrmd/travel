import { NextRequest, NextResponse } from 'next/server'
import { mockLeads } from '@/lib/data/mock-leads'
import { mockPackages } from '@/lib/data/mock-packages'
import { agentProfile } from '@/lib/data/mock-agent-jamaah'
import { createCommission, getCurrentTierInfo } from '@/lib/data/mock-commissions'

/**
 * API Endpoint: Convert Lead to Jamaah
 *
 * POST /api/leads/convert
 *
 * Purpose: Converts a qualified lead into a paying jamaah (customer).
 * This triggers commission calculation and tracking.
 *
 * Flow:
 * 1. Validate lead exists and is not already converted
 * 2. Get package details (to get retail price)
 * 3. Get agent details (to get tier for commission calculation)
 * 4. Create jamaah record
 * 5. Create commission record (PENDING until payment complete)
 * 6. Update lead status to 'converted'
 * 7. Increment agent jamaah count (for tier progression)
 *
 * Security: Requires authentication (agent can only convert their own leads)
 */

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    const { leadId, jamaahData } = body

    // Validation
    if (!leadId || !jamaahData) {
      return NextResponse.json(
        { error: 'Missing required fields: leadId, jamaahData' },
        { status: 400 }
      )
    }

    // Get lead
    const lead = mockLeads.find(l => l.id === leadId)
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Check if already converted
    if (lead.status === 'converted') {
      return NextResponse.json(
        { error: 'Lead already converted to jamaah' },
        { status: 400 }
      )
    }

    // Get package details (for retail price)
    const packageData = mockPackages.find(p => p.id === lead.packageId)
    if (!packageData) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    // Get agent details (for tier)
    // For now, we only support the single agentProfile from mock-agent-jamaah
    if (lead.agentId !== agentProfile.id) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }
    const agent = agentProfile

    // TODO: In production, verify authentication and ensure agent can only convert their own leads
    // if (currentUserId !== lead.agentId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    // }

    // Get current tier (for commission calculation)
    const tierInfo = getCurrentTierInfo(agent.assignedJamaahCount)

    // Create jamaah record
    // TODO: In production, save to actual database
    const jamaahId = `jamaah-${Date.now()}`
    console.log('Creating jamaah:', {
      id: jamaahId,
      name: jamaahData.name,
      nik: jamaahData.nik,
      phone: jamaahData.phone,
      email: jamaahData.email,
      birthDate: jamaahData.birthDate,
      address: jamaahData.address,
      gender: jamaahData.gender,
      packageId: packageData.id,
      packageName: packageData.name,
      packagePrice: packageData.priceRetail, // RETAIL price
      agentId: lead.agentId,
      status: 'pending-documents',
    })

    // Update lead status to converted
    lead.status = 'converted'
    lead.convertedToJamaahId = jamaahId
    console.log('✅ Lead converted:', lead.id, '→', jamaahId)

    // Create commission record (PENDING until payment complete)
    const commission = createCommission({
      jamaahId,
      jamaahName: jamaahData.name,
      packageId: packageData.id,
      packageName: packageData.name,
      packagePrice: packageData.priceRetail, // Commission from RETAIL price
      agentId: lead.agentId,
      tier: tierInfo.tier,
      leadId: lead.id,
    })

    console.log('💰 Commission created:', {
      id: commission.id,
      amount: commission.commissionAmount,
      rate: commission.commissionRate,
      tier: commission.tier,
      status: commission.status,
    })

    // Increment agent jamaah count (for tier progression)
    // TODO: In production, update in database
    agent.assignedJamaahCount += 1
    console.log(`📈 Agent jamaah count updated: ${agent.assignedJamaahCount}`)

    // Check if tier changed
    const newTierInfo = getCurrentTierInfo(agent.assignedJamaahCount)
    if (newTierInfo.tier !== tierInfo.tier) {
      console.log(`🎉 TIER UPGRADE: ${tierInfo.tier} → ${newTierInfo.tier}`)
      // TODO: Send notification to agent about tier upgrade
    }

    // TODO: In production:
    // 1. Send WebSocket notification to agent
    // 2. Send email notification to agent
    // 3. Send WhatsApp notification to agent
    // 4. Log event for analytics

    // Return success response
    return NextResponse.json(
      {
        success: true,
        jamaahId,
        commission: {
          id: commission.id,
          amount: commission.commissionAmount,
          rate: commission.commissionRate,
          tier: commission.tier,
          status: commission.status,
        },
        tierUpgrade: newTierInfo.tier !== tierInfo.tier ? {
          oldTier: tierInfo.tier,
          newTier: newTierInfo.tier,
          newRate: newTierInfo.commissionRate,
        } : undefined,
        message: 'Lead successfully converted to jamaah',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Lead conversion error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
