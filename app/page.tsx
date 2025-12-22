
import AuthCtaButtons from "./components/AuthCtaButtons";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 px-4">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-6xl font-extrabold tracking-tight text-gray-900">
          Earn Respect.<br />
          <span className="text-blue-600">Get Reviewed.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Review Share is a community-driven marketplace. Review other creator's extensions to earn credentials,
          and use that respect to get your own products featured.
        </p>

        <AuthCtaButtons />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 text-left">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🤝</div>
            <h3 className="font-bold text-lg mb-2">Give Reviews</h3>
            <p className="text-gray-600">Earn +1 Respect for every verified review you leave on the Chrome Web Store.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">💎</div>
            <h3 className="font-bold text-lg mb-2">Earn Respect</h3>
            <p className="text-gray-600">Respect is your currency. You need &gt; 0 Respect to be visible in the market.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-2xl mb-2">🚀</div>
            <h3 className="font-bold text-lg mb-2">Get Featured</h3>
            <p className="text-gray-600">When you have respect, your product appears in the market. Receiving a review costs -1 Respect.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
