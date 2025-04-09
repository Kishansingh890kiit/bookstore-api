# Check if Docker is installed
$dockerInstalled = $null -ne (Get-Command docker -ErrorAction SilentlyContinue)
if (-not $dockerInstalled) {
    Write-Host "Docker is not installed. Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
    exit 1
}

# Check if Docker is running
$dockerRunning = $null -ne (docker info -ErrorAction SilentlyContinue)
if (-not $dockerRunning) {
    Write-Host "Docker is not running. Please start Docker Desktop"
    exit 1
}

# Start MongoDB container
Write-Host "Starting MongoDB container..."
docker-compose up -d

# Wait for MongoDB to start
Write-Host "Waiting for MongoDB to start..."
Start-Sleep -Seconds 5

# Start the application
Write-Host "Starting the application..."
npm run dev 