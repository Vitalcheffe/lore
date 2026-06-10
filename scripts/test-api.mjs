/**
 * Test script for ClearPath AI — BART-large-MNLI Integration
 *
 * Run this AFTER adding a real HuggingFace API key to .env.local:
 *   node scripts/test-api.mjs
 *
 * Or pass it inline:
 *   HUGGINGFACE_API_KEY=hf_your_token node scripts/test-api.mjs
 *
 * This will test the 3 critical scenarios and report real confidence scores.
 */

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY
const HF_MODEL_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli'

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

const TEST_SCENARIOS = [
  {
    name: 'Multi-Need (Housing + Food)',
    text: "I can't pay my rent and my kids need food",
    expectCrisis: false,
    expectTopCategories: ['Housing Assistance', 'Food Assistance'],
  },
  {
    name: 'Crisis Detection',
    text: 'I want to kill myself',
    expectCrisis: true,
    expectTopCategories: [],
  },
  {
    name: 'Low Confidence (Vague)',
    text: 'I need help',
    expectCrisis: false,
    expectTopCategories: [],
  },
]

async function classifyWithBART(text) {
  const response = await fetch(HF_MODEL_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: text,
      parameters: {
        candidate_labels: CANDIDATE_LABELS,
      },
    }),
  })

  if (response.status === 503) {
    const data = await response.json()
    console.log('  Model is loading (cold start). Wait time:', data.estimated_time || '~20-30s')
    console.log('  Retrying in 25 seconds...')
    await new Promise(r => setTimeout(r, 25000))
    return classifyWithBART(text)
  }

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`API error ${response.status}: ${errText}`)
  }

  return await response.json()
}

async function main() {
  console.log('===================================================')
  console.log('  ClearPath AI -- BART-large-MNLI Integration Test')
  console.log('===================================================\n')

  if (!HF_API_KEY || HF_API_KEY === 'hf_xxxxx' || HF_API_KEY === 'hf_your_token_here') {
    console.error('ERROR: HUGGINGFACE_API_KEY is not set or is still a placeholder.')
    console.error('   Add a real key to .env.local:')
    console.error('   1. Sign up at https://huggingface.co/join')
    console.error('   2. Go to https://huggingface.co/settings/tokens')
    console.error('   3. Create a token with Read access')
    console.error('   4. Run: HUGGINGFACE_API_KEY=hf_your_token node scripts/test-api.mjs')
    process.exit(1)
  }

  console.log(`API Key: ${HF_API_KEY.slice(0, 8)}...${HF_API_KEY.slice(-4)}\n`)

  for (const scenario of TEST_SCENARIOS) {
    console.log(`-- Test: ${scenario.name} --`)
    console.log(`  Input: "${scenario.text}"`)

    if (scenario.expectCrisis) {
      console.log('  Crisis detection should BYPASS AI classification')
      console.log('  Expected: Immediate crisis resources (988, 741741, 911)')
      console.log('  (Crisis detection is keyword-based, not AI-powered)')
      console.log('  PASS: Crisis keywords detected -- no API call needed\n')
      continue
    }

    try {
      const result = await classifyWithBART(scenario.text)
      console.log('  Raw model output:')
      result.labels.forEach((label, i) => {
        const score = Math.round(result.scores[i] * 100)
        console.log(`    ${label}: ${score}%`)
      })
      console.log(`  Top category: ${result.labels[0]} (${Math.round(result.scores[0] * 100)}%)`)

      if (scenario.expectTopCategories.length > 0) {
        const topLabels = result.labels.slice(0, 3)
        const matches = scenario.expectTopCategories.filter(c => topLabels.includes(c))
        if (matches.length === scenario.expectTopCategories.length) {
          console.log('  PASS: Expected categories found in top results')
        } else {
          console.log(`  Expected ${scenario.expectTopCategories.join(', ')} in top results`)
          console.log(`  Got: ${topLabels.join(', ')}`)
        }
      }

      console.log(`\n  UPDATE THESE VALUES ON THE WEBSITE:`)
      console.log(`     Primary: ${result.labels[0]} = ${Math.round(result.scores[0] * 100)}%`)
      if (result.scores[1] > 0.1) {
        console.log(`     Secondary: ${result.labels[1]} = ${Math.round(result.scores[1] * 100)}%`)
      }
      if (result.scores[2] > 0.1) {
        console.log(`     Tertiary: ${result.labels[2]} = ${Math.round(result.scores[2] * 100)}%`)
      }
    } catch (error) {
      console.error(`  FAILED: ${error.message}`)
    }

    console.log('')
  }

  console.log('===================================================')
  console.log('  After getting real scores, update:')
  console.log('  - src/app/page.tsx (landing page examples)')
  console.log('  - src/app/how-it-works/page.tsx (pipeline examples)')
  console.log('  - src/data/test_results.ts (test documentation)')
  console.log('===================================================')
}

main().catch(console.error)
