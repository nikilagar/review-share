import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white border-t py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm text-gray-500">
                <div>
                    &copy; {new Date().getFullYear()} Review Share. All rights reserved.
                </div>
                <div className="flex gap-4">
                    <a href="mailto:contact@earnreviewkarma.com" className="hover:text-blue-600 transition-colors">
                        Contact
                    </a>
                    <Link href="/privacy" className="hover:text-blue-600 transition-colors">
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </footer>
    );
}
