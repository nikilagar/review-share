
import AuthCtaButtons from "./components/AuthCtaButtons";
import TrustStats from "./components/TrustStats";
import ReviewsGrowthChart from "./components/ReviewsGrowthChart";
import SocialProof from "./components/SocialProof";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="flex flex-col items-center pt-20 px-4 pb-16">
        <div className="max-w-3xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Trusted by 100+ developers
          </div>

          <h1 className="text-6xl font-extrabold tracking-tight text-gray-900">
            Earn Respect.<br />
            <span className="text-blue-600">Get Reviewed.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Friendly Review is a community-driven marketplace. Review other creator's extensions to earn credentials,
            and use that respect to get your own products featured.
          </p>

          <AuthCtaButtons />

          {/* Guarantee Badge */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 px-6 py-3 rounded-xl mt-6">
            <span className="text-2xl">✅</span>
            <div className="text-left">
              <p className="font-semibold text-green-800">Guaranteed: At least 5 reviews within 24 hours</p>
              <p className="text-sm text-green-600">Get 20+ reviews within your first week</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 text-left">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300">
              <div className="text-2xl mb-2">🤝</div>
              <h3 className="font-bold text-lg mb-2">Give Reviews</h3>
              <p className="text-gray-600">Earn +1 Respect for every verified review you leave on the Chrome Web Store.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300">
              <div className="text-2xl mb-2">💎</div>
              <h3 className="font-bold text-lg mb-2">Earn Respect</h3>
              <p className="text-gray-600">Respect is your currency. You need &gt; 0 Respect to be visible in the market.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300">
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="font-bold text-lg mb-2">Get Featured</h3>
              <p className="text-gray-600">When you have respect, your product appears in the market. Receiving a review costs -1 Respect.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Section */}
      <section className="px-4 max-w-5xl mx-auto">
        <TrustStats />
      </section>

      {/* Growth Chart Section */}
      <section className="px-4">
        <ReviewsGrowthChart />
      </section>

      {/* Social Proof Section */}
      <section className="px-4 max-w-5xl mx-auto">
        <SocialProof />
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to grow your extension?
          </h2>
          <p className="text-blue-100 mb-8">
            Join thousands of developers and start earning reviews today.
          </p>
          <AuthCtaButtons variant="dark" />
        </div>
      </section>
    </main>
  );
}
