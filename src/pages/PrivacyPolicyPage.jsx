export default function PrivacyPolicyPage() {
  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="max-w-3xl mx-auto space-y-6 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Privacy Policy</h1>
        <p className="text-xs text-gray-400">Last updated: July 21, 2026</p>

        <p className="text-sm text-gray-700 leading-relaxed">
          EventPass ("we", "our", or "us") is committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, disclose, and safeguard your
          information when you use our WhatsApp ticketing and QR‑code delivery platform.
        </p>

        <h2 className="text-lg font-semibold text-gray-800">Information We Collect</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          We collect information that you provide directly to us, such as:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Contact details (name, email address, phone number) when you register an account.</li>
          <li>Event attendee data (names, phone numbers, event names) that you upload for the purpose of sending QR‑code passes.</li>
          <li>Payment information (processed securely by our third‑party payment providers; we do not store full card details).</li>
        </ul>

        <p className="text-sm text-gray-700 leading-relaxed">
          We also automatically collect certain information when you use the platform, including:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Log data (IP address, browser type, pages visited).</li>
          <li>Usage data (features used, campaign statistics).</li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-800">How We Use Your Information</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          We use the collected information to:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Provide, maintain, and improve our services.</li>
          <li>Send WhatsApp messages on your behalf to event attendees.</li>
          <li>Communicate with you about your account and campaigns.</li>
          <li>Comply with legal obligations.</li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-800">Data Sharing</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          We do not sell your personal information. We may share data with:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Meta Platforms, Inc., solely for sending WhatsApp messages via the WhatsApp Business API.</li>
          <li>Cloud service providers (e.g., Cloudinary) used to host generated QR‑code images.</li>
          <li>Legal authorities if required by law.</li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-800">Data Retention</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          We retain your personal data for as long as your account is active or as needed to
          provide you services. Attendee data uploaded for campaigns is stored until the campaign is
          deleted by you or automatically after 12 months of inactivity.
        </p>

        <h2 className="text-lg font-semibold text-gray-800">Your Rights</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          You have the right to access, correct, or delete your personal data. You can manage most
          of your data through the platform’s interface. To request complete deletion of your account
          and all associated data, please contact us at <strong>support@qrcl.ng</strong>.
        </p>

        <h2 className="text-lg font-semibold text-gray-800">Contact Us</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us at:
          <br />
          <strong>Email:</strong> support@qrcl.ng
          <br />
          <strong>Address:</strong> 123 EventPass Street, Lagos, Nigeria.
        </p>
      </div>
    </div>
  );
}