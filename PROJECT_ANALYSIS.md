# Dialectica Project Analysis and Enhancement Roadmap

## 1. Project Summary

Dialectica is a browser-based assistive collaboration platform built around the
Devlympics **Bridge the Gap** theme.

Its primary bridge is:

> People with motor or speech impairments <-> fast-moving engineering teams

The user communicates through gaze, gestures, voice input, or predefined intent
cards. Dialectica converts that input into natural speech and shared
collaboration context.

The core interaction loop is:

```text
Webcam or microphone input
        |
Gaze, blink, gesture, or speech recognition
        |
Intent card selection
        |
Gemini expands the intent into natural language
        |
Text-to-speech, meeting transcript, and Slack broadcast
```

This is a strong interpretation of the theme because it connects:

- Non-verbal users with verbal teams
- Physical interaction limitations with digital collaboration tools
- Technical complexity with clearer communication
- Individual intent with team-wide context

## 2. Current Technology Stack

### Frontend and application framework

| Technology | Current use |
| --- | --- |
| Next.js 16.4.2 | App Router, pages, and API route handlers |
| React 19.3 | Interactive dashboard and UI components |
| TypeScript 5 | Application and domain types |
| Tailwind CSS 4 | Styling and responsive layouts |
| Lucide React | Icons and interface visuals |

Important application entry points:

- `app/page.tsx` - landing page
- `app/dashboard/page.tsx` - main assistive collaboration dashboard
- `app/hud/page.tsx` - floating HUD experience
- `app/layout.tsx` - global layout, authentication provider, and Bridge Guide

### AI and natural-language processing

The project uses Google Gemini through `@google/generative-ai`.

Current AI capabilities include:

- Expanding a short intent into a natural spoken sentence
- Distilling meeting dialogue into four gaze-selectable response cards
- Generating technical review cards from code or diff context
- Explaining the product through the Bridge Guide chatbot
- Providing local heuristic fallbacks when the Gemini API is unavailable

Main implementation:

- `lib/ai/geminiService.ts`

API routes:

- `app/api/bridge-chat/route.ts`
- `app/api/distill-meeting/route.ts`
- `app/api/expand-intent/route.ts`
- `app/api/ingest-context/route.ts`

### Computer vision and gaze interaction

The project uses MediaPipe Tasks Vision and the Face Landmarker model.

Current vision capabilities include:

- 478 facial landmarks
- Iris landmarks `468` and `473`
- Eye Aspect Ratio blink detection
- Prolonged blink cancellation
- Webcam access through `getUserMedia`
- GPU delegate support
- User calibration
- One Euro Filter gaze smoothing
- Four-quadrant radial interaction

Main implementation:

- `components/vision/EyeTracker.tsx`
- `lib/vision/irisTracker.ts`
- `lib/vision/calibration.ts`
- `lib/vision/oneEuroFilter.ts`

The project also supports head gestures:

- Nod
- Head shake
- Brow raise

Gesture implementation:

- `lib/vision/gestureTracker.ts`

### Speech and audio

The browser-native speech and audio layer uses:

- Web Speech Recognition
- `webkitSpeechRecognition`
- Speech Synthesis
- Web Audio API
- Audio analyser and FFT visualization
- Audio chimes for interaction feedback
- Configurable voice pitch and speaking rate

Main implementation:

- `lib/audio/speechService.ts`
- `components/meeting/MeetingRoom.tsx`

### Authentication and client state

The current prototype includes:

- Google Identity Services
- Email signup and login
- Google credential decoding
- React Context session state
- `localStorage` persistence for accounts, profiles, calibration, and sessions

Main implementation:

- `lib/auth/AuthContext.tsx`

This is suitable for a local prototype or judging demo, but it is not
production-ready authentication. Passwords and sessions should not be stored in
browser storage for a real deployment.

### Collaboration and integrations

Current collaboration capabilities include:

- `BroadcastChannel` synchronization between dashboard and floating HUD
- Slack incoming webhook support
- Document Picture-in-Picture support
- Browser microphone access
- Simulated meeting participants
- Preset code review scenarios

Relevant components:

- `components/meeting/MeetingRoom.tsx`
- `components/integrations/SlackIntegrationModal.tsx`
- `components/code/CodeReviewBridge.tsx`
- `components/hud/RadialHUD.tsx`

### Demonstration and analytics

The project includes:

- Feel the Gap simulator
- Traditional eye-keyboard comparison
- Gaze-based phrase selection benchmark
- Effective WPM display
- Fatigue and aborted interaction counts
- Voice profile customization
- Macro phrase packs
- Caregiver safeguard UI
- Analytics dashboard

Relevant components:

- `components/experience/FeelTheGapSimulator.tsx`
- `components/analytics/AnalyticsDashboard.tsx`
- `components/safety/CaregiverSafeguard.tsx`
- `components/studio/MacroStudio.tsx`

## 3. Current Feature Coverage

The application currently contains:

1. Assistive gaze cockpit
2. Four-quadrant intent HUD
3. Blink-based cancel guard
4. Head gesture controls
5. Webcam calibration
6. Meeting microphone transcription
7. Gemini meeting distillation
8. Gemini intent expansion
9. Text-to-speech response
10. Slack broadcasting
11. Code review bridge
12. Macro phrase packs
13. Custom voice persona
14. Floating HUD window
15. Caregiver safeguard
16. Quantitative benchmark simulator
17. Bridge Guide chatbot
18. Analytics dashboard
19. Google login UI
20. Email signup and login UI

The project is technically ambitious. Its main product risk is that the scope
is wider than the central story.

## 4. Strengths

### Direct theme alignment

Dialectica demonstrates a real bridge rather than only describing one:

```text
The user expresses intent with gaze
        |
Dialectica interprets the intent
        |
The team receives a clear spoken response
```

### Strong demonstration narrative

The Feel the Gap simulator lets judges experience the communication problem
before seeing the solution. This is more persuasive than a feature list.

### Technical differentiation

The combination of computer vision, gaze interaction, gesture recognition,
AI-generated speech, and collaboration context is more distinctive than a
standard chatbot or CRUD application.

### Offline and failure-tolerant demo behavior

The Gemini service includes local fallback logic. This helps the core demo
continue when the API key is missing or network access is unreliable.

## 5. Current Gaps and Risks

### 5.1 The product is too broad

Dialectica currently presents itself as an AAC tool, meeting assistant, code
review assistant, Slack connector, caregiver monitor, voice personalization
platform, analytics system, and technical context translator.

The strongest positioning should be:

> Dialectica turns gaze-based intent into real-time spoken participation for
> engineering teams.

Other features should support this message instead of competing with it.

### 5.2 Some integrations are simulated

The code review experience uses predefined pull request scenarios, and the
meeting room includes simulated participants.

For transparency, label these as:

- Demo PR
- Simulated teammate
- Sample meeting context

The preset flows are valuable for a reliable demo, but they should not be
presented as live GitHub or live conferencing integrations.

### 5.3 Authentication is not production-ready

The current client-side authentication stores user data and password values in
`localStorage`. A production version should use:

- Server-side authentication
- Password hashing
- HTTP-only secure cookies
- Session expiry and revocation
- Server-side authorization
- Database-backed user profiles

### 5.4 Analytics are primarily client-side

Several dashboard values are initialized or calculated in the browser. They are
useful for demonstration but are not yet persistent, auditable product metrics.

Define each metric precisely, especially:

- Effective WPM
- Gaze accuracy
- Selection latency
- Fatigue
- Intent accuracy
- Time saved

Clearly label simulated metrics during the judging demo.

### 5.5 AI responses need stronger validation

Several AI routes parse model output directly. A malformed response could break
the interaction flow.

AI responses should be validated for:

- Exactly four cards where required
- Supported quadrant values
- Required text fields
- Maximum text length
- Supported categories
- Safe fallback behavior

### 5.6 Browser support is limited

Speech recognition depends on browser-specific APIs such as
`SpeechRecognition` and `webkitSpeechRecognition`.

The interface should:

- Display browser compatibility status
- Explain microphone permissions
- Provide a visible fallback when recognition is unavailable
- Keep mouse simulation available for demonstrations

### 5.7 External model dependencies affect reliability

The MediaPipe WASM runtime and face landmark model are loaded from external
URLs. A live demo may be affected by network or CDN failures.

Consider:

- Model loading progress
- Caching
- Preloading
- CDN failure messaging
- A reliable mouse simulation mode
- A local or bundled model strategy where licensing and bundle size permit

## 6. Recommended Enhancements

## Priority 1: Strengthen the core bridge loop

### A. Add an explicit Bridge Mode

Create a guided flow with five visible stages:

```text
1. Listen
2. Understand
3. Choose intent
4. Speak
5. Confirm with team
```

Show the data moving from one side to the other:

- Left: live teammate speech
- Center: AI context cards
- Right: gaze-selected response and synthesized speech

This will make the theme immediately understandable to judges.

### B. Add a translation trace

When a user selects a card, display:

```text
Raw input:
Question about auth middleware

Detected intent:
Request clarification

Spoken bridge:
Could you clarify how the middleware handles token expiration during refresh?
```

This proves that the system is translating intent instead of only playing a
canned phrase.

### C. Add confirmation and undo

Gaze interactions can accidentally trigger actions. Add:

- Confirmation dwell
- Spoken preview before dispatch
- Blink-to-cancel
- Head shake to undo
- Undo last response
- Clear visual and audio feedback

The best integration point is the existing radial HUD.

### D. Improve the fallback engine

The fallback engine should preserve:

- Active meeting topic
- User role
- User tone
- Technical vocabulary
- Current speaker context

This keeps the experience useful even without Gemini.

## Priority 2: Improve accessibility

### A. Add multiple input modes

Support:

- Keyboard navigation
- Mouse or trackpad
- Switch-control input
- Head gestures
- Voice input
- Large touch targets
- High-contrast mode
- Reduced-motion mode

Gaze should remain the flagship interaction, but not the only meaningful
interaction.

### B. Add visual accessibility controls

Provide settings for:

- Font size
- Contrast
- Color-blind-safe indicators
- Dwell duration
- Dead-zone size
- Gaze sensitivity
- Audio volume
- Captions
- Reduced animation

Do not rely only on color to communicate state.

### C. Add live captions

The meeting room should show:

- Interim transcript
- Final transcript
- Speaker label
- Confidence indicator
- Explicit "AI-generated summary" labels

### D. Add multilingual support

The theme explicitly includes language gaps, making multilingual support a
strong future extension:

```text
Teammate speaks Hindi
        |
Live translation
        |
User selects an intent in English
        |
Team receives an English or Hindi response
```

Potential technologies:

- Gemini multilingual translation
- Managed speech-to-text with language detection
- Browser Speech Synthesis where supported
- User-selectable input and output languages

Stabilize the primary English flow before adding this as a second demo path.

## Priority 3: Add real collaboration integrations

### A. Real GitHub integration

Add:

- GitHub OAuth or GitHub App authentication
- Repository and pull request selection
- Live diff retrieval
- File and line-level comments
- Draft review creation
- Explicit confirmation before submitting a review

Recommended technologies:

- GitHub App
- Octokit
- Server-side API routes
- GitHub webhooks

Keep the current preset scenarios as a reliable Demo Mode.

### B. Improve Slack integration

The current Slack route is `app/api/slack-broadcast/route.ts`.

Improve it with:

- Slack OAuth installation
- Workspace and channel selection
- Server-side encrypted token storage
- Delivery verification
- Retry handling
- User-facing failure states
- Threaded messages
- Optional caption or transcript attachments

Avoid accepting arbitrary webhook URLs directly from the browser in production.

### C. Add real-time collaboration

For multi-user rooms, consider:

- WebRTC
- LiveKit
- Daily
- Socket.IO
- Supabase Realtime

Synchronize:

- Floor reservation
- Current speaker
- Selected intent
- Transcript
- Captions
- Team acknowledgements

`BroadcastChannel` is useful for multiple tabs on one browser, but it does not
provide multi-user networking.

## Priority 4: Add persistence and a backend

### Suggested stack

| Need | Recommendation |
| --- | --- |
| Authentication | Supabase Auth, Auth.js, or Better Auth |
| Database | PostgreSQL |
| User profiles | PostgreSQL |
| Macro packs | PostgreSQL |
| Calibration profiles | PostgreSQL or encrypted client storage |
| Meeting history | PostgreSQL with retention controls |
| File and context storage | Supabase Storage or S3-compatible storage |
| Realtime state | Supabase Realtime or WebSockets |
| Product analytics | PostHog, Sentry, or OpenTelemetry |
| API validation | Zod |
| Testing | Vitest and Playwright |

Supabase is a practical option because it combines authentication, PostgreSQL,
storage, and realtime features.

### Suggested entities

```text
User
VoiceProfile
GazeCalibration
MacroPack
MacroOption
Meeting
TranscriptEntry
BridgeInteraction
AnalyticsEvent
IntegrationConnection
CaregiverContact
```

An interaction record could contain:

```text
userId
inputMethod
rawIntent
expandedText
selectedQuadrant
latencyMs
wasCancelled
confidence
createdAt
```

This would make the improvement metrics persistent and demonstrable.

## Priority 5: Improve AI reliability and safety

Use a validation pipeline:

```text
Gemini response
        |
JSON parse
        |
Schema validation
        |
Length and safety checks
        |
UI card generation
```

Zod is a good choice for validating AI responses.

Reject or fallback when:

- The response does not contain the expected number of cards
- A card has missing speech text
- Text exceeds a safe length
- The model returns an unsupported category
- The output is irrelevant or unsafe

### Privacy controls

Because the app processes webcam data, voice, transcripts, code, and
accessibility information, add:

- Camera-active indicator
- Microphone-active indicator
- Consent before recording
- Local-only mode
- Delete transcript action
- Transcript retention settings
- Sensitive-data redaction before Gemini requests
- Clear explanation of whether webcam frames are uploaded

### Latency metrics

Track:

```text
Speech received
        |
AI cards generated
        |
Gaze selected
        |
Speech started
```

Display:

- Speech-to-card latency
- Card-to-speech latency
- Total response latency
- Cancel rate
- False selection rate
- Average dwell time

## 7. Recommended Judging Demo

Do not demonstrate every feature. Use one focused narrative.

### Suggested four-minute flow

#### Step 1: Establish the gap

Have a teammate ask:

> Can you review the authentication PR and tell us whether it is safe to merge?

Explain that a person who cannot reliably speak or type may struggle to
participate in this fast exchange.

#### Step 2: Demonstrate the old interaction

Run the traditional keyboard section of the Feel the Gap simulator.

Show:

- Character-by-character selection
- Long response time
- Increasing teammate wait time
- Floor collision or interruption

#### Step 3: Demonstrate Dialectica

Use gaze or mouse simulation:

1. Meeting speech is captured.
2. Gemini creates four context-aware cards.
3. The user selects a card with gaze.
4. Dwell confirms the selection.
5. AI expands the intent.
6. Speech synthesis responds to the team.
7. The response appears in the transcript and Slack.

#### Step 4: Show measurable impact

Display:

- Response time
- Number of selections
- Effective WPM
- Cancelled actions
- Saved interaction time
- Accuracy

#### Step 5: Close with the product vision

Use this closing statement:

> Dialectica does not replace the user's voice or decisions. It gives their
> intent a reliable path into the conversation.

## 8. Roadmap

### Hackathon and demo readiness

1. Stabilize gaze and mouse simulation modes.
2. Add a clear bridge visualization.
3. Add a translation trace from input to spoken response.
4. Add confirmation and undo.
5. Label simulated data honestly.
6. Add browser compatibility and permission states.
7. Add one multilingual demo path.
8. Add measured latency and accuracy metrics.
9. Add AI response validation.
10. Improve loading and error states.

### Next product version

1. Server-side authentication.
2. PostgreSQL persistence.
3. Real GitHub integration.
4. Real Slack OAuth integration.
5. Multi-user realtime rooms.
6. Reliable cloud speech recognition.
7. Meeting captions and speaker identification.
8. User-specific calibration profiles.
9. Privacy and transcript retention controls.
10. Automated accessibility testing.

### Longer-term direction

1. Personalized AAC phrase recommendations.
2. Adaptive gaze models per user.
3. Multilingual real-time communication.
4. Zoom, Google Meet, and Microsoft Teams integrations.
5. Switch-access hardware support.
6. Offline-first operation.
7. Consent-based caregiver and clinician reporting.
8. Clinical usability studies.
9. Assistive technology certification work.
10. Enterprise compliance and audit logging.

## 9. Final Assessment

The current technology choices are strong for a prototype:

- Next.js and React provide a good application shell.
- MediaPipe enables the distinctive gaze interaction.
- Gemini provides contextual language translation.
- Web Speech APIs make the demo inexpensive and accessible.
- The HUD, simulator, meeting room, and code review modules create a
  compelling story.

The most important improvement is not adding more features. It is making the
single bridge loop more obvious, reliable, measurable, and trustworthy:

> Gaze or gesture -> intent -> contextual language -> speech -> team
> understanding

Focus the product around this loop, then add persistence, integrations,
accessibility controls, privacy protections, and structured AI validation around
it.
