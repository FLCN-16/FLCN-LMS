function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mx-auto mb-8 max-w-md text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might have
          been moved or no longer exists.
        </p>
        <a
          href="/"
          className="inline-block rounded-md bg-primary px-6 py-2 text-primary-foreground transition-opacity hover:opacity-90"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}

export default NotFound
