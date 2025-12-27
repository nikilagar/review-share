export default function DemoVideo() {
    return (
        <div className="w-full max-w-5xl mx-auto mt-12 mb-8">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 bg-gray-900">
                <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/4MqgIZA3UBo?rel=0&modestbranding=1"
                    title="Friendly Review Demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
            <p className="text-center text-sm text-gray-400 mt-4">
                See how it works in 60 seconds
            </p>
        </div>
    )
}
