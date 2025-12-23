import React from 'react';

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-gray-50 py-20 px-4">
            <div className="max-w-3xl mx-auto space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
                <p className="text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">1. Introduction</h2>
                    <p className="text-gray-600">
                        Welcome to Review Share ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy explains our practices regarding the collection, use, and disclosure of your information.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">2. Information We Collect</h2>
                    <p className="text-gray-600">
                        We collect information that you provide directly to us when you use our services, such as when you create an account, update your profile, or communicate with us. This may include your name, email address, and authentication information from third-party providers.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">3. How We Use Your Information</h2>
                    <p className="text-gray-600">
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                        <li>Provide, maintain, and improve our services.</li>
                        <li>Process transactions and manage your account.</li>
                        <li>Send you technical notices, updates, security alerts, and support messages.</li>
                        <li>Respond to your comments, questions, and requests.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">4. Contact Us</h2>
                    <p className="text-gray-600">
                        If you have any questions about this Privacy Policy, please contact us at:
                        <br />
                        <a href="mailto:contact@friendlyreview.com" className="text-blue-600 hover:text-blue-800">
                            contact@friendlyreview.com
                        </a>
                    </p>
                </section>
            </div>
        </main>
    );
}
