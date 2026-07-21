export default function TermsOfServicePage() {
  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="max-w-3xl mx-auto space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Terms of Service</h1>
        <p className="text-xs text-gray-400">Last updated: July 21, 2026</p>

        <p className="text-sm text-gray-700 leading-relaxed">
          Welcome to EventPass. By using our platform, you agree to these Terms of Service.
          Please read them carefully before using the service.
        </p>

        <h2 className="text-lg font-semibold text-gray-800">1. Acceptance of Terms</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          By accessing or using EventPass (the "Service"), you agree to be bound by these
          Terms. If you do not agree, do not use the Service.
        </p>

        <h2 className="text-lg font-semibold text-gray-800">2. Description of Service</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          EventPass provides a platform for event organizers to upload attendee data, generate
          personalised QR‑code tickets, and send them via WhatsApp. You are responsible for
          obtaining all necessary consents from your attendees before uploading their data.
        </p>

        <h2 className="text-lg font-semibold text-gray-800">3. User Obligations</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          You agree to:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Provide accurate and complete information when creating an account.</li>
          <li>Use the Service only for lawful purposes and in compliance with WhatsApp's policies.</li>
          <li>Ensure that all recipients have opted in to receive messages via WhatsApp.</li>
          <li>Not use the Service for spam, phishing, or any malicious activity.</li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-800">4. Intellectual Property</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          All content, features, and functionality of the Service are owned by EventPass and
          are protected by international copyright and trademark laws. You may not copy,
          modify, or distribute any part of the Service without our prior written consent.
        </p>

        <h2 className="text-lg font-semibold text-gray-800">5. Limitation of Liability</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          EventPass is provided "as is" without any warranties. We are not liable for any
          damages arising from the use of the Service, including but not limited to message
          delivery failures, data loss, or third‑party actions (e.g., WhatsApp or Cloudinary).
        </p>

        <h2 className="text-lg font-semibold text-gray-800">6. Termination</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          We reserve the right to suspend or terminate your account at any time if you
          violate these Terms. Upon termination, your right to use the Service will
          immediately cease.
        </p>

        <h2 className="text-lg font-semibold text-gray-800">7. Changes to Terms</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          We may update these Terms from time to time. Continued use of the Service after
          any changes constitutes your acceptance of the new Terms.
        </p>

        <h2 className="text-lg font-semibold text-gray-800">8. Contact</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          For questions about these Terms, please contact us at:
          <br />
          <strong>Email:</strong> support@qrcl.ng
          <br />
          <strong>Address:</strong> 123 EventPass Street, Lagos, Nigeria.
        </p>
      </div>
    </div>
  );
}