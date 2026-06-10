import { NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

// ─── GET /api/test-hf ────────────────────────────────────
// Diagnostic endpoint — tests the HuggingFace API connection
// using BOTH raw fetch and the official SDK. Returns detailed
// error info. Remove before production.

const HF_MODEL_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli'
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY

const CANDIDATE_LABELS = [
  'Housing Assistance',
  'Food Assistance',
  'Mental Health',
  'Employment Services',
  'Legal Aid',
  'Healthcare',
  'Crisis Support',
  'Senior Services',
]

export async function GET() {
  const diagnostics: Record<string, unknown> = {}

  // 1. Check if API key exists
  diagnostics.apiKeyPresent = !!HF_API_KEY
  diagnostics.apiKeyPrefix = HF_API_KEY ? HF_API_KEY.substring(0, 5) + '...' : 'MISSING'
  diagnostics.apiKeyIsPlaceholder = HF_API_KEY === 'hf_xxxxx'

  if (!HF_API_KEY || HF_API_KEY === 'hf_xxxxx') {
    return NextResponse.json({
      status: 'error',
      message: 'HUGGINGFACE_API_KEY is missing or is still the placeholder',
      diagnostics,
    })
  }

  // 2. Test basic outbound connectivity
  try {
    const googleStart = Date.now()
    const googleResp = await fetch('https://httpbin.org/get', {
      signal: AbortSignal.timeout(10_000),
    })
    diagnostics.connectivityTest = {
      target: 'httpbin.org',
      status: googleResp.status,
      timeMs: Date.now() - googleStart,
      ok: googleResp.ok,
    }
  } catch (connErr) {
    diagnostics.connectivityTest = {
      error: connErr instanceof Error ? connErr.message : String(connErr),
      cause: connErr instanceof Error && connErr.cause ? String(connErr.cause) : null,
    }
  }

  // 3. Test with official @huggingface/inference SDK
  const testInput = 'I lost my job and need help with rent'
  diagnostics.testInput = testInput
  diagnostics.candidateLabels = CANDIDATE_LABELS

  try {
    const hf = new HfInference(HF_API_KEY)
    const sdkStart = Date.now()

    const result = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: testInput,
      parameters: {
        candidate_labels: CANDIDATE_LABELS,
      },
    })

    diagnostics.sdkTimeMs = Date.now() - sdkStart
    diagnostics.sdkResult = result
    diagnostics.sdkSuccess = true

    return NextResponse.json({
      status: 'success',
      diagnostics,
    })
  } catch (sdkError) {
    diagnostics.sdkError = sdkError instanceof Error ? sdkError.message : String(sdkError)
    diagnostics.sdkErrorType = sdkError instanceof Error ? sdkError.constructor.name : typeof sdkError
    diagnostics.sdkErrorCause = sdkError instanceof Error && sdkError.cause ? String(sdkError.cause) : null
    diagnostics.sdkSuccess = false
  }

  // 4. Fallback: Try raw fetch with explicit options
  try {
    diagnostics.modelUrl = HF_MODEL_URL
    const fetchStart = Date.now()

    const response = await fetch(HF_MODEL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: testInput,
        parameters: {
          candidate_labels: CANDIDATE_LABELS,
        },
      }),
      signal: AbortSignal.timeout(30_000),
    })

    diagnostics.fetchStatus = response.status
    diagnostics.fetchStatusText = response.statusText
    diagnostics.fetchTimeMs = Date.now() - fetchStart

    const responseText = await response.text()
    diagnostics.rawResponseBody = responseText.substring(0, 500)

    let parsedBody: unknown = null
    try {
      parsedBody = JSON.parse(responseText)
      diagnostics.parsedResponse = parsedBody
    } catch {
      diagnostics.jsonParseError = 'Response is not valid JSON'
    }

    diagnostics.fetchSuccess = response.ok

    return NextResponse.json({
      status: response.ok ? 'success' : 'error',
      diagnostics,
    })
  } catch (fetchError) {
    diagnostics.fetchError = fetchError instanceof Error ? fetchError.message : String(fetchError)
    diagnostics.fetchErrorType = fetchError instanceof Error ? fetchError.constructor.name : typeof fetchError
    diagnostics.fetchErrorCause = fetchError instanceof Error && fetchError.cause ? String(fetchError.cause) : null
    diagnostics.fetchSuccess = false

    return NextResponse.json({
      status: 'error',
      message: 'Both SDK and raw fetch failed',
      diagnostics,
    })
  }
}
